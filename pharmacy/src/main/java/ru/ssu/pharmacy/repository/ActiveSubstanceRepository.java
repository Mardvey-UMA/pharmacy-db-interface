package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.ActiveSubstance;

public interface ActiveSubstanceRepository extends JpaRepository<ActiveSubstance, Long> {
}

