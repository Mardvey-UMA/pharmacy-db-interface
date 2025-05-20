package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.SaleMedication;

import java.util.List;

public interface SaleMedicationRepository extends JpaRepository<SaleMedication, Long> {
    List<SaleMedication> findBySaleId(Long saleId);
}

