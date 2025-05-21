package ru.ssu.pharmacy.dto.report;

import java.math.BigDecimal;
import java.util.List;

public record EmployeesReportDto(
        Long totalEmployees,
        List<EmployeesByPositionDto> employeesByPosition,
        List<TopEmployeeDto> topEmployees,
        List<EmployeesByPharmacyDto> employeesByPharmacy
) {
    public record EmployeesByPositionDto(String position, Long count) {}
    public record TopEmployeeDto(String name, String position, Long salesCount, BigDecimal totalRevenue) {}
    public record EmployeesByPharmacyDto(String pharmacyAddress, Long employeeCount) {}
}
