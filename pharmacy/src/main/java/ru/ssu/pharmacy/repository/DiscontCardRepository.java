package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.DiscontCard;

public interface DiscontCardRepository extends JpaRepository<DiscontCard, Long> {
}
