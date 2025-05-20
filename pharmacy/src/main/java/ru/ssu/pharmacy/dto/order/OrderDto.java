package ru.ssu.pharmacy.dto.order;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OrderDto(
        Long id,
        String orderAddress,
        LocalDate orderDate,
        String status,
        Long clientId,
        String clientName,
        BigDecimal total
) {}

