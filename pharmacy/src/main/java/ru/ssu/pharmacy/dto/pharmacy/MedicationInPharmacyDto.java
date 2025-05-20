package ru.ssu.pharmacy.dto.pharmacy;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MedicationInPharmacyDto(
        Long id,
        String name,
        String form,
        LocalDate expirationDate,
        BigDecimal price,
        Long quantity
) {}

