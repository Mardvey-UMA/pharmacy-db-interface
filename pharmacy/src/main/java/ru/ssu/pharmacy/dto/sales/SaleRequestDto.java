package ru.ssu.pharmacy.dto.sales;

import java.util.List;

public record SaleRequestDto(
        Long pharmacyId,
        Long employeeId,
        List<MedicationQuantityDto> medications,
        Long discountCardId,
        String prescriptionNumber
) {}

