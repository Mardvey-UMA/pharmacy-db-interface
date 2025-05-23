package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssu.pharmacy.entity.Employee;
import ru.ssu.pharmacy.entity.Sale;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByFullNameContainingIgnoreCase(String name);
    List<Employee> findByPharmacyIdAndPositionIdAndIdNot(Long pharmacyId, Long positionId, Long excludeId);

}