package ru.ssu.pharmacy.dto.sales;

import java.math.BigDecimal;

public record MedicationShortDto(
        String name,
        Long quantity,
        BigDecimal price
) {}

