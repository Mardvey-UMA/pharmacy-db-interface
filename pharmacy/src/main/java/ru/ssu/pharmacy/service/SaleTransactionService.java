package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.sales.MedicationQuantityDto;
import ru.ssu.pharmacy.dto.sales.SaleRequestDto;
import ru.ssu.pharmacy.entity.*;
import ru.ssu.pharmacy.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleTransactionService {

    private final MedicationRepository medicationRepo;
    private final SaleRepository saleRepo;
    private final SaleMedicationRepository saleMedicationRepo;
    private final StorageRepository storageRepo;
    private final DiscontCardRepository discontCardRepo;
    private final EmployeeRepository employeeRepo;
    private final PharmacyRepository pharmacyRepo;

    @Transactional
    public void processSale(SaleRequestDto dto) {
        checkPrescriptionRequirement(dto);

        Pharmacy pharmacy = pharmacyRepo.findById(dto.pharmacyId())
                .orElseThrow(() -> new IllegalArgumentException("Аптека не найдена"));
        Employee employee = employeeRepo.findById(dto.employeeId())
                .orElseThrow(() -> new IllegalArgumentException("Сотрудник не найден"));
        DiscontCard discontCard = dto.discountCardId() != null ?
                discontCardRepo.findById(dto.discountCardId()).orElse(null) : null;

        Sale sale = new Sale();
        sale.setSaleDate(LocalDate.now());
        sale.setSaleTime(LocalTime.now());
        sale.setEmployee(employee);
        sale.setDiscontCard(discontCard);
        sale = saleRepo.save(sale);

        List<SaleMedication> saleMedications = new ArrayList<>();

        for (MedicationQuantityDto mq : dto.medications()) {
            Medication medication = medicationRepo.findById(mq.medicationId())
                    .orElseThrow(() -> new IllegalArgumentException("Лекарство не найдено"));

            List<Storage> stocks = storageRepo.findByMedicationAndPharmacy(medication, pharmacy);
            long available = stocks.stream().mapToLong(Storage::getQuantity).sum();

            if (available < mq.quantity()) {
                throw new IllegalArgumentException("Недостаточно лекарства %s. Доступно: %d, Требуется: %d"
                        .formatted(medication.getMedicationName(), available, mq.quantity()));
            }

            BigDecimal price = stocks.stream()
                    .sorted((a, b) -> b.getExpirationDate().compareTo(a.getExpirationDate()))
                    .findFirst()
                    .map(s -> s.getPurchasePrice().multiply(BigDecimal.valueOf(1.3)))
                    .orElseThrow();

            SaleMedication saleMed = new SaleMedication();
            saleMed.setSale(sale);
            saleMed.setMedication(medication);
            saleMed.setQuantity(mq.quantity());
            saleMed.setPrice(price);
            saleMedications.add(saleMed);

            updateStocks(stocks, mq.quantity());
        }

        saleMedicationRepo.saveAll(saleMedications);

        if (discontCard != null) {
            applyDiscount(sale, discontCard.getDiscount());
        }
    }

    private void checkPrescriptionRequirement(SaleRequestDto dto) {
        boolean needPrescription = dto.medications().stream()
                .map(mq -> medicationRepo.findById(mq.medicationId()).orElseThrow())
                .anyMatch(m -> Boolean.TRUE.equals(m.getActiveSubstance().getNeedRecipe()));

        if (needPrescription && (dto.prescriptionNumber() == null || dto.prescriptionNumber().isBlank())) {
            throw new IllegalArgumentException("Для одного или нескольких препаратов требуется рецепт");
        }
    }

    private void updateStocks(List<Storage> stocks, long requiredQuantity) {
        long remaining = requiredQuantity;

        for (Storage stock : stocks) {
            if (remaining <= 0) break;

            if (stock.getQuantity() > remaining) {
                stock.setQuantity(stock.getQuantity() - remaining);
                remaining = 0;
            } else {
                remaining -= stock.getQuantity();
                stock.setQuantity(0L);
            }
            storageRepo.save(stock);
        }
    }

    private void applyDiscount(Sale sale, BigDecimal discount) {
        BigDecimal total = sale.getSaleMedications().stream()
                .map(m -> m.getPrice().multiply(BigDecimal.valueOf(m.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountedTotal = total.multiply(
                BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100)))
        );

        sale.getSaleMedications().forEach(m -> {
            BigDecimal originalPrice = m.getPrice();
            BigDecimal discountedPrice = originalPrice.multiply(
                    BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100)))
            );
            m.setPrice(discountedPrice);
        });

        saleMedicationRepo.saveAll(sale.getSaleMedications());
    }
}