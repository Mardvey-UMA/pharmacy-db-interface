package ru.ssu.pharmacy.dto.order;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OrderFilterDto(
        String status,
        BigDecimal minSum,
        BigDecimal maxSum,
        LocalDate fromDate,
        LocalDate toDate,
        Long clientId
) {}

