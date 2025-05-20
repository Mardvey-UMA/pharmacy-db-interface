package ru.ssu.pharmacy.dto.order;

import java.math.BigDecimal;

public record OrderMedicationDto(
        Long id,
        Long quantity,
        BigDecimal price,
        Long medicationId,
        String medicationName
) {}

