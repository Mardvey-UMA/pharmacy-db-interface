package ru.ssu.pharmacy.dto.employee;

import java.util.List;

public record EmployeeDeleteResponseDto(
        Long deletedEmployeeId,
        String deletedEmployeeName,
        String pharmacyAddress,
        String positionDescription,
        List<AssignmentChangeDto> changes
) {}
