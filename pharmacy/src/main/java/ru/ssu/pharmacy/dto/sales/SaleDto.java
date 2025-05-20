package ru.ssu.pharmacy.dto.sales;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record SaleDto(
        Long id,
        LocalDate saleDate,
        LocalTime saleTime,
        String employeeName,
        String clientName,
        BigDecimal total
) {}

