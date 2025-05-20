package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
}

