package ru.ssu.pharmacy.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.ssu.pharmacy.dto.auth.AuthResponseDto;
import ru.ssu.pharmacy.dto.auth.LoginRequestDto;
import ru.ssu.pharmacy.dto.auth.RegisterRequestDto;
import ru.ssu.pharmacy.entity.Client;
import ru.ssu.pharmacy.entity.DiscontCard;
import ru.ssu.pharmacy.repository.ClientRepository;
import ru.ssu.pharmacy.repository.DiscontCardRepository;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final ClientRepository clientRepository;
    private final DiscontCardRepository discontCardRepository;

    @Transactional
    public ResponseEntity<?> register(RegisterRequestDto request) {
        if (clientRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        // Создаем клиента
        Client client = new Client();
        client.setFullName(request.fullName());
        client.setUsername(request.username());
        client.setPassword(request.password());
        client.setUserRole("USER");
        clientRepository.save(client);

        // Создаем дисконтную карту
        DiscontCard card = new DiscontCard();
        card.setClient(client);
        card.setDiscount(new BigDecimal("10.00"));
        discontCardRepository.save(card);

        return ResponseEntity.ok(
                new AuthResponseDto(
                        client.getFullName(),
                        client.getId(),
                        client.getUsername(),
                        client.getUserRole(),
                        card.getId(),
                        card.getDiscount()
                )
        );
    }
    public ResponseEntity<?> login(LoginRequestDto request) {
        Client client = clientRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!request.password().equals(client.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        DiscontCard card = discontCardRepository.findByClientId(client.getId()).orElse(null);

        return ResponseEntity.ok(
                new AuthResponseDto(
                        client.getFullName(),
                        client.getId(),
                        client.getUsername(),
                        client.getUserRole(),
                        card != null ? card.getId() : null,
                        card != null ? card.getDiscount() : null
                )
        );
    }
}
