package ru.ssu.pharmacy.dto.employee;

public record AssignmentChangeDto(
        String entityType,          // "ORDER" | "SALE"
        Long entityId,              // id заказа или продажи
        String role,
        Long newEmployeeId,
        String newEmployeeName
) {}