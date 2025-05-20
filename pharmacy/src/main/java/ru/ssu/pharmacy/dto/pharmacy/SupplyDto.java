package ru.ssu.pharmacy.dto.pharmacy;

import java.time.LocalDate;
import java.time.LocalTime;

public record SupplyDto(
        Long id,
        LocalDate supplyDate,
        LocalTime supplyTime,
        Boolean accepted,
        String vendorName
) {}

