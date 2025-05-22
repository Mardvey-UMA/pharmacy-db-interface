package ru.ssu.pharmacy.dto.client;

import ru.ssu.pharmacy.entity.Client;

public record ClientDto(Long id, String fullName, String username, String role) {
    public static ClientDto from(Client client) {
        return new ClientDto(
                client.getId(),
                client.getFullName(),
                client.getUsername(),
                client.getUserRole()
        );
    }
}
