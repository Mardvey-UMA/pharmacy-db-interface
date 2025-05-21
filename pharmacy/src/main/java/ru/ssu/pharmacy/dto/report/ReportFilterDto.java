package ru.ssu.pharmacy.dto.report;

import java.time.LocalDate;

public record ReportFilterDto(
        LocalDate fromDate,
        LocalDate toDate,
        Long pharmacyId
) {}
