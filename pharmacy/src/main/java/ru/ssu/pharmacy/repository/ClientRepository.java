package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Client;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByUsername(String username);
    boolean existsByUsername(String username);
}

