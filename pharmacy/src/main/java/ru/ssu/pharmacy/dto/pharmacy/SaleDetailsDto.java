package ru.ssu.pharmacy.dto.pharmacy;

import ru.ssu.pharmacy.dto.sales.MedicationShortDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record SaleDetailsDto(
        Long id,
        LocalDate saleDate,
        LocalTime saleTime,
        String employeeName,
        String clientName,
        BigDecimal total,
        List<MedicationShortDto> items
) {}

