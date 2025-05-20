package ru.ssu.pharmacy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.medication.MedicationCreateDto;
import ru.ssu.pharmacy.entity.Medication;
import ru.ssu.pharmacy.entity.Storage;
import ru.ssu.pharmacy.entity.Supply;
import ru.ssu.pharmacy.repository.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepo;
    private final SupplyRepository supplyRepo;
    private final VendorRepository vendorRepo;
    private final PharmacyRepository pharmacyRepo;
    private final StorageRepository storageRepo;
    private final ActiveSubstanceRepository activeSubstanceRepo;

    public void createMedication(MedicationCreateDto dto) {
        Medication medication = new Medication();
        medication.setMedicationName(dto.medicationName());
        medication.setForm(dto.form());
        medication.setMedicationDescription(dto.medicationDescription());
        medication.setActiveSubstance(activeSubstanceRepo.findById(dto.activeSubstanceId()).orElseThrow());

        medication = medicationRepo.save(medication);

        Supply supply;
        if (dto.supplyId() != null) {
            supply = supplyRepo.findById(dto.supplyId()).orElseThrow();
        } else {
            supply = new Supply();
            supply.setSupplyDate(LocalDate.now());
            supply.setSupplyTime(LocalTime.now());
            supply.setAccepted(true);
            supply.setVendor(vendorRepo.findById(dto.vendorId()).orElseThrow());
            supply.setPharmacy(pharmacyRepo.findById(dto.pharmacyId()).orElseThrow());
            supply = supplyRepo.save(supply);
        }

        Storage storage = new Storage();
        storage.setMedication(medication);
        storage.setQuantity(dto.quantity());
        storage.setPurchasePrice(dto.purchasePrice());
        storage.setExpirationDate(dto.expirationDate());
        storage.setSupply(supply);

        storageRepo.save(storage);
    }
}

