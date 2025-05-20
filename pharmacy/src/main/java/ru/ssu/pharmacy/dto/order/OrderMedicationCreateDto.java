package ru.ssu.pharmacy.dto.order;

import java.math.BigDecimal;

public record OrderMedicationCreateDto(
        Long medicationId,
        Long quantity,
        BigDecimal price
) {}

