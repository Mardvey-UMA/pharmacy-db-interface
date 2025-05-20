package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Medication;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
}

