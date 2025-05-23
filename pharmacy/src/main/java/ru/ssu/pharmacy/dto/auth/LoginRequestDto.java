package ru.ssu.pharmacy.dto.auth;

public record LoginRequestDto(
        String username,
        String password) {}
