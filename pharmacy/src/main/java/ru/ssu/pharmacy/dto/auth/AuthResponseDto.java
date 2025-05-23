package ru.ssu.pharmacy.dto.auth;

import java.math.BigDecimal;

public record AuthResponseDto(
        String fullName,
        Long userId,
        String username,
        String role,
        Long discountCardId,
        BigDecimal discount
) {}
