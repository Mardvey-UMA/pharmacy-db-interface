package ru.ssu.pharmacy.dto.order;

public record OrderStatusUpdateDto(
        String newStatus,
        Long courierId // nullable, нужен только если newStatus = "доставка"
) {}

