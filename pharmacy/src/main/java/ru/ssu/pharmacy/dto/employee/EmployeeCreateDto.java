package ru.ssu.pharmacy.dto.employee;

public record EmployeeCreateDto(
        String fullName,
        String passport,
        Long pharmacyId,
        Long positionId
) {}
