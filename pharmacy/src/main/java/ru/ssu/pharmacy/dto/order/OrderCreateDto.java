package ru.ssu.pharmacy.dto.order;

import java.util.List;

public record OrderCreateDto(
        Long clientId,
        Long pharmacyId,
        String orderAddress,
        List<OrderMedicationCreateDto> medications,
        List<Long> assemblerIds,
        List<Long> courierIds
) {}

