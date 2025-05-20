package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {}
