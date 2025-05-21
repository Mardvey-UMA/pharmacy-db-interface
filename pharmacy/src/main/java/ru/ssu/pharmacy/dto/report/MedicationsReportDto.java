package ru.ssu.pharmacy.dto.report;

import java.util.List;

public record MedicationsReportDto(
        Long totalMedications,
        List<LowStockMedicationDto> lowStockMedications,
        List<ExpiringMedicationDto> expiringMedications,
        List<TopMedicationQuantityDto> topMedications
) {
    public record LowStockMedicationDto(String name, Long quantity, String pharmacyAddress) {}
    public record ExpiringMedicationDto(String name, String expirationDate, Long quantity, String pharmacyAddress) {}
    public record TopMedicationQuantityDto(String name, Long totalQuantity, Integer pharmaciesCount) {}
}