package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.order.*;
import ru.ssu.pharmacy.entity.*;
import ru.ssu.pharmacy.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final ClientOrderRepository orderRepo;
    private final OrderMedicationRepository orderMedRepo;
    private final ClientRepository clientRepo;
    private final PharmacyRepository pharmacyRepo;
    private final EmployeeRepository employeeRepo;
    private final MedicationRepository medicationRepo;

    @PersistenceContext
    private EntityManager em;

    public List<OrderDto> filterOrders(OrderFilterDto filter) {
        Specification<ClientOrder> spec = Specification.where(null);

        if (filter.status() != null && !filter.status().isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), filter.status()));
        }
        if (filter.clientId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("client").get("id"), filter.clientId()));
        }
        if (filter.fromDate() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("orderDate"), filter.fromDate()));
        }
        if (filter.toDate() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("orderDate"), filter.toDate()));
        }

        List<ClientOrder> orders = orderRepo.findAll(spec);

        return orders.stream()
                .map(order -> {
                    BigDecimal total = calculateTotal(order);
                    return new OrderDto(
                            order.getId(),
                            order.getOrderAddress(),
                            order.getOrderDate(),
                            order.getStatus(),
                            order.getClient().getId(),
                            order.getClient().getFullName(),
                            total
                    );
                })
                .filter(orderDto ->
                        (filter.minSum() == null || orderDto.total().compareTo(filter.minSum()) >= 0) &&
                                (filter.maxSum() == null || orderDto.total().compareTo(filter.maxSum()) <= 0)
                )
                .toList();
    }

    public OrderDetailsDto getOrderDetails(Long id) {
        ClientOrder order = orderRepo.findById(id).orElseThrow();
        List<OrderMedication> meds = orderMedRepo.findByOrderId(id);
        BigDecimal total = calculateTotal(order);

        List<OrderMedicationDto> medDtos = meds.stream().map(m -> new OrderMedicationDto(
                m.getId(),
                m.getQuantity(),
                m.getPrice(),
                m.getMedication().getId(),
                m.getMedication().getMedicationName()
        )).toList();

        List<Long> assemblerIds = order.getAssemblers().stream()
                .map(Employee::getId)
                .toList();

        List<Long> courierIds = order.getCouriers().stream()
                .map(Employee::getId)
                .toList();

        return new OrderDetailsDto(
                order.getId(),
                order.getOrderAddress(),
                order.getOrderDate(),
                order.getStatus(),
                order.getClient().getId(),
                order.getClient().getFullName(),
                total,
                medDtos,
                assemblerIds,
                courierIds
        );
    }
    @Transactional
    public ClientOrder createOrder(OrderCreateDto dto) {
        Client client = clientRepo.findById(dto.clientId())
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));

        Pharmacy pharmacy = pharmacyRepo.findById(dto.pharmacyId())
                .orElseThrow(() -> new IllegalArgumentException("Аптека не найдена"));

        ClientOrder order = new ClientOrder();
        order.setClient(client);
        order.setOrderAddress(dto.orderAddress());
        order.setOrderDate(LocalDate.now());
        order.setStatus("обработка");

        // Привязка сборщиков и курьеров
        Set<Employee> assemblers = new HashSet<>();
        for (Long id : dto.assemblerIds()) {
            Employee emp = employeeRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Сборщик с id " + id + " не найден"));
            assemblers.add(emp);
        }
        order.setAssemblers(assemblers);

        Set<Employee> couriers = new HashSet<>();
        for (Long id : dto.courierIds()) {
            Employee emp = employeeRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Курьер с id " + id + " не найден"));
            couriers.add(emp);
        }
        order.setCouriers(couriers);

        order = orderRepo.save(order);

        ClientOrder finalOrder = order;
        List<OrderMedication> meds = dto.medications().stream()
                .map(medDto -> {
                    Medication medication = medicationRepo.findById(medDto.medicationId())
                            .orElseThrow(() -> new IllegalArgumentException("Медикамент с id " + medDto.medicationId() + " не найден"));

                    OrderMedication om = new OrderMedication();
                    om.setOrder(finalOrder);
                    om.setMedication(medication);
                    om.setQuantity(medDto.quantity());
                    om.setPrice(medDto.price());
                    return om;
                }).toList();

        orderMedRepo.saveAll(meds);

        return order;
    }
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus, Long courierId) {
        StoredProcedureQuery query = em.createStoredProcedureQuery("update_order_status");
        query.registerStoredProcedureParameter("order_id", Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("new_status", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("courier_id", Integer.class, ParameterMode.IN);

        query.setParameter("order_id", orderId.intValue());
        query.setParameter("new_status", newStatus);
        if ("доставка".equalsIgnoreCase(newStatus)) {
            if (courierId == null) {
                throw new IllegalArgumentException("Курьер обязателен при смене статуса на 'доставка'");
            }
            query.setParameter("courier_id", courierId.intValue());
        } else {
            query.setParameter("courier_id", null);
        }

        try {
            query.execute();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при обновлении статуса заказа: " + e.getMessage(), e);
        }
    }

    private BigDecimal calculateTotal(ClientOrder order) {
        return order.getMedications().stream()
                .map(m -> m.getPrice().multiply(BigDecimal.valueOf(m.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
