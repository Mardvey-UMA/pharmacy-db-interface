package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
}

