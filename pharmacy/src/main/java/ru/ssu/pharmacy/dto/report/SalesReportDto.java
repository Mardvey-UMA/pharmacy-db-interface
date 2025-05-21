package ru.ssu.pharmacy.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

public record SalesReportDto(
        Long totalSales,
        BigDecimal totalRevenue,
        BigDecimal averageCheck,
        List<TopMedicationDto> topMedications,
        List<SalesByDayDto> salesByDay
) {
    public record TopMedicationDto(String name, Long quantity, BigDecimal revenue) {}

    public record SalesByDayDto(
            LocalDate date,
            Long sales,
            BigDecimal revenue
    ) {
        public String getDateAsString() {
            return date.format(DateTimeFormatter.ISO_DATE);
        }
    }
}