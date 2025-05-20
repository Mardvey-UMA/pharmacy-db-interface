package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.OrderMedication;

import java.util.List;

public interface OrderMedicationRepository extends JpaRepository<OrderMedication, Long> {
    List<OrderMedication> findByOrderId(Long orderId);
}

