package ru.ssu.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ssu.pharmacy.dto.pharmacy.MedicationInPharmacyDto;
import ru.ssu.pharmacy.dto.pharmacy.MedicationInPharmacyDtoExtend;
import ru.ssu.pharmacy.entity.Medication;
import ru.ssu.pharmacy.entity.Pharmacy;
import ru.ssu.pharmacy.entity.Storage;

import java.util.List;

public interface StorageRepository extends JpaRepository<Storage, Long> {
    @Query("""
        SELECT new ru.ssu.pharmacy.dto.pharmacy.MedicationInPharmacyDto(
            m.id, m.medicationName, m.form, s.expirationDate,
            s.purchasePrice, s.quantity
        )
        FROM Storage s
        JOIN s.medication m
        JOIN s.supply sp
        WHERE sp.pharmacy.id = :pharmacyId
        ORDER BY 
            CASE WHEN :sort = 'expiration' THEN s.expirationDate END ASC,
            CASE WHEN :sort = 'name' THEN m.medicationName END ASC
    """)
    List<MedicationInPharmacyDto> findMedications(@Param("pharmacyId") Long pharmacyId, @Param("sort") String sort);

    @Query("""
    SELECT new ru.ssu.pharmacy.dto.pharmacy.MedicationInPharmacyDtoExtend(
        m.id,
        m.medicationName,
        m.form,
        s.purchasePrice,
        s.quantity,
        a.category,
        s.expirationDate,
        sp.pharmacy.id
    )
    FROM Storage s
    JOIN s.medication m
    JOIN m.activeSubstance a
    JOIN s.supply sp
    WHERE sp.pharmacy.id = :pharmacyId
    ORDER BY s.expirationDate ASC
""")
    List<MedicationInPharmacyDtoExtend> findMedicationsByPharmacyId(@Param("pharmacyId") Long pharmacyId);

    @Query("SELECT s FROM Storage s " +
            "JOIN s.supply sp " +
            "WHERE s.medication = :medication AND sp.pharmacy = :pharmacy " +
            "ORDER BY s.expirationDate ASC")
    List<Storage> findByMedicationAndPharmacy(
            @Param("medication") Medication medication,
            @Param("pharmacy") Pharmacy pharmacy
    );
}
