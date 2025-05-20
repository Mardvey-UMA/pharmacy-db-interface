package ru.ssu.pharmacy.dto.pharmacy;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MedicationInPharmacyDtoExtend(
        Long id,
        String name,
        String form,
        BigDecimal price,
        Long quantity,
        String activeSubstance,
        LocalDate expirationDate,
        Long pharmacyId
) {}

