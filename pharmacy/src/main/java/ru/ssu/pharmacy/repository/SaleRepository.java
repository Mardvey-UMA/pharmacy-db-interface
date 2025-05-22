package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ssu.pharmacy.entity.Sale;

import java.time.LocalDate;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long>, JpaSpecificationExecutor<Sale> {
//    @Query("""
//    SELECT s FROM Sale s
//    JOIN s.employee e
//    WHERE (:pharmacyId IS NULL OR e.pharmacy.id = :pharmacyId)
//      AND (:from IS NULL OR s.saleDate >= :from)
//      AND (:to IS NULL OR s.saleDate <= :to)
//    ORDER BY s.saleDate DESC, s.saleTime DESC
//""")
//    List<Sale> filter(
//            @Param("pharmacyId") Long pharmacyId,
//            @Param("from") LocalDate from,
//            @Param("to") LocalDate to
//    );
    List<Sale> findAllByEmployeePharmacyId(Long pharmacyId);
    List<Sale> findByDiscontCardClientId(Long clientId);

}