package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.DiscontCard;

import java.util.Optional;

public interface DiscontCardRepository extends JpaRepository<DiscontCard, Long> {
    Optional<DiscontCard> findByClientId(Long clientId);
}
