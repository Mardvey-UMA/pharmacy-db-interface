package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.employee.*;
import ru.ssu.pharmacy.entity.ClientOrder;
import ru.ssu.pharmacy.entity.Employee;
import ru.ssu.pharmacy.entity.Sale;
import ru.ssu.pharmacy.mapper.EmployeeMapper;
import ru.ssu.pharmacy.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepo;
    private final PharmacyRepository pharmacyRepo;
    private final PositionRepository positionRepo;
    private final EmployeeMapper employeeMapper;
    private final ClientOrderRepository orderRepo;
    private final SaleRepository saleRepo;

    @PersistenceContext
    private EntityManager em;

    public List<EmployeeDto> searchEmployees(String name) {
        return employeeRepo.findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(emp -> {
                    EmployeeDto dto = employeeMapper.toDto(emp);
                    dto = new EmployeeDto(
                            dto.id(),
                            dto.fullName(),
                            dto.passport(),
                            dto.positionDescription(),
                            calculateFinalSalary(emp),
                            dto.pharmacyAddress()
                    );
                    return dto;
                })
                .toList();
    }

    public EmployeeDto getById(Long id) {
        return employeeRepo.findById(id)
                .map(emp -> {
                    EmployeeDto dto = employeeMapper.toDto(emp);
                    dto = new EmployeeDto(
                            dto.id(),
                            dto.fullName(),
                            dto.passport(),
                            dto.positionDescription(),
                            calculateFinalSalary(emp),
                            dto.pharmacyAddress()
                    );
                    return dto;
                }).orElseThrow();
    }

    public EmployeeDto create(EmployeeCreateDto dto) {
        Employee emp = employeeMapper.toEntity(dto);
        emp.setPharmacy(pharmacyRepo.findById(dto.pharmacyId()).orElseThrow());
        emp.setPosition(positionRepo.findById(dto.positionId()).orElseThrow());
        emp = employeeRepo.save(emp);
        return getById(emp.getId());
    }

    public EmployeeDto update(Long id, EmployeeUpdateDto dto) {
        Employee emp = employeeRepo.findById(id).orElseThrow();
        emp.setFullName(dto.fullName());
        emp.setPassport(dto.passport());
        emp.setPosition(positionRepo.findById(dto.positionId()).orElseThrow());
        return getById(employeeRepo.save(emp).getId());
    }

    @Transactional
    public EmployeeDeleteResponseDto delete(Long id) {

        Employee victim = employeeRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Сотрудник не найден"));

        // 1. ищем замену
        List<Employee> pool = employeeRepo
                .findByPharmacyIdAndPositionIdAndIdNot(
                        victim.getPharmacy().getId(),
                        victim.getPosition().getId(),
                        id);

        if (pool.isEmpty()) {
            throw new IllegalStateException(
                    "Невозможно удалить – в \"" +
                            victim.getPharmacy().getPharmacyAddress() +
                            "\" больше нет сотрудников-" +
                            victim.getPosition().getPositionDescription());
        }

        int cursor = 0;                   // для round-robin
        List<AssignmentChangeDto> log = new ArrayList<>();

        /* --- Заказы: сборщики --- */
        for (ClientOrder o : orderRepo.findAllByAssemblerId(id)) {
            Employee newEmp = pool.get(cursor++ % pool.size());
            o.getAssemblers().remove(victim);
            o.getAssemblers().add(newEmp);

            log.add(new AssignmentChangeDto(
                    "ORDER", o.getId(), "ASSEMBLER",
                    newEmp.getId(), newEmp.getFullName()));
        }

        /* --- Заказы: курьеры --- */
        for (ClientOrder o : orderRepo.findAllByCourierId(id)) {
            Employee newEmp = pool.get(cursor++ % pool.size());
            o.getCouriers().remove(victim);
            o.getCouriers().add(newEmp);

            log.add(new AssignmentChangeDto(
                    "ORDER", o.getId(), "COURIER",
                    newEmp.getId(), newEmp.getFullName()));
        }

        /* --- Продажи --- */
        for (Sale s : saleRepo.findByEmployeeId(id)) {
            Employee newEmp = pool.get(cursor++ % pool.size());
            s.setEmployee(newEmp);

            log.add(new AssignmentChangeDto(
                    "SALE", s.getId(), "SALE_EMPLOYEE",
                    newEmp.getId(), newEmp.getFullName()));
        }

        // flush/merge выполнятся автоматически по завершении @Transactional
        employeeRepo.delete(victim);

        return new EmployeeDeleteResponseDto(
                victim.getId(),
                victim.getFullName(),
                victim.getPharmacy().getPharmacyAddress(),
                victim.getPosition().getPositionDescription(),
                log
        );
    }

    private BigDecimal calculateFinalSalary(Employee employee) {
        String sql = "SELECT * FROM get_employees_with_salary(:pharmacy_id)";
        List<Object[]> result = em.createNativeQuery(sql)
                .setParameter("pharmacy_id", employee.getPharmacy().getId().intValue())
                .getResultList();

        for (Object[] row : result) {
            if (Objects.equals(row[0], employee.getFullName())) {
                return (BigDecimal) row[2];
            }
        }
        return employee.getPosition().getSalary();
    }

}

