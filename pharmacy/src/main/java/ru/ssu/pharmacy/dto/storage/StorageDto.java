package ru.ssu.pharmacy.dto.storage;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StorageDto(
        Long id,
        Long quantity,
        LocalDate expirationDate,
        BigDecimal purchasePrice,
        Long supplyId,
        Long medicationId
) {}

