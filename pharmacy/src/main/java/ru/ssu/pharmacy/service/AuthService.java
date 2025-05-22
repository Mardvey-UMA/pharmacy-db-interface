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
import ru.ssu.pharmacy.repository.ClientRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final ClientRepository clientRepository;

    @Transactional
    public ResponseEntity<?> register(RegisterRequestDto request) {
        if (clientRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        Client client = new Client();
        client.setFullName(request.fullName());
        client.setUsername(request.username());
        client.setPassword(request.password());
        client.setUserRole("USER");
        clientRepository.save(client);

        return ResponseEntity.ok(
                new AuthResponseDto(client.getId(), client.getUsername(), client.getUserRole())
        );
    }

    public ResponseEntity<?> login(LoginRequestDto request) {
        Client client = clientRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!request.password().equals(client.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        return ResponseEntity.ok(
                new AuthResponseDto(client.getId(), client.getUsername(), client.getUserRole())
        );
    }
}
