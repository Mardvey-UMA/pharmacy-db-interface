package ru.ssu.pharmacy.dto.sales;

import java.time.LocalDate;

public record SaleFilterDto(
        LocalDate from,
        LocalDate to,
        Long pharmacyId
) {}

