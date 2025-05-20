package ru.ssu.pharmacy.dto.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OrderDetailsDto(
        Long id,
        String orderAddress,
        LocalDate orderDate,
        String status,
        Long clientId,
        String clientName,
        BigDecimal total,
        List<OrderMedicationDto> medications,
        List<Long> assemblerIds,
        List<Long> courierIds
) {}

