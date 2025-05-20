package ru.ssu.pharmacy.dto.medication;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MedicationCreateDto(
        String medicationName,
        String form,
        String medicationDescription,
        Long activeSubstanceId,
        Long quantity,
        BigDecimal purchasePrice,
        LocalDate expirationDate,
        Long supplyId,        // nullable — если не указано, создаётся новая поставка
        Long vendorId,        // для создания новой поставки
        Long pharmacyId       // для новой поставки
) {}

