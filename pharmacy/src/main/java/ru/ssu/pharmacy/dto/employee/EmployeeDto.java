package ru.ssu.pharmacy.dto.employee;

import java.math.BigDecimal;

public record EmployeeDto(
        Long id,
        String fullName,
        String passport,
        String positionDescription,
        BigDecimal finalSalary,
        String pharmacyAddress
) {}

