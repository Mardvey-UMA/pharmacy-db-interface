package ru.ssu.pharmacy.dto.employee;

public record EmployeeUpdateDto(
        String fullName,
        String passport,
        Long positionId
) {}

