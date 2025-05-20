package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.dto.employee.EmployeeDto;
import ru.ssu.pharmacy.dto.pharmacy.*;
import ru.ssu.pharmacy.dto.sales.SaleDto;
import ru.ssu.pharmacy.entity.Pharmacy;
import ru.ssu.pharmacy.mapper.PharmacyMapper;
import ru.ssu.pharmacy.repository.*;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final PharmacyRepository pharmacyRepo;
    private final EmployeeRepository employeeRepo;
    private final StorageRepository storageRepo;
    private final SupplyRepository supplyRepo;
    private final SaleRepository saleRepo;
    private final PharmacyMapper pharmacyMapper;

    @PersistenceContext
    private EntityManager em;

    public List<PharmacyDto> search(String query) {
        return pharmacyRepo.findByPharmacyAddressContainingIgnoreCase(query)
                .stream()
                .map(pharmacyMapper::toDto)
                .toList();
    }

    public PharmacyDetailsDto getDetails(Long id, String sort) {
        Pharmacy pharmacy = pharmacyRepo.findById(id).orElseThrow();

        List<EmployeeDto> employees = getEmployeesWithSalary(pharmacy.getId());

        List<SupplyDto> supplies = supplyRepo.findAllByPharmacyId(pharmacy.getId())
                .stream()
                .map(pharmacyMapper::toDto)
                .toList();

        List<SaleDto> sales = saleRepo.findAllByEmployeePharmacyId(pharmacy.getId())
                .stream()
                .map(pharmacyMapper::toDto)
                .toList();

        List<MedicationInPharmacyDto> meds = storageRepo.findMedications(pharmacy.getId(), sort);

        return new PharmacyDetailsDto(
                pharmacy.getId(),
                pharmacy.getPharmacyAddress(),
                employees,
                supplies,
                meds,
                sales
        );
    }

    public List<EmployeeDto> getEmployeesWithSalary(Long pharmacyId) {
        String sql = "SELECT * FROM get_employees_with_salary(:pharmacy_id)";
        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("pharmacy_id", pharmacyId.intValue())
                .getResultList();

        return rows.stream()
                .map(r -> new EmployeeDto(
                        null,
                        (String) r[0],
                        null,
                        (String) r[1],
                        (BigDecimal) r[2],
                        null
                ))
                .toList();
    }
    public List<SimpleDictDto> getPharmacyDict() {
        return pharmacyRepo.findAll().stream()
                .map(p -> new SimpleDictDto(p.getPharmacyAddress(), p.getId()))
                .toList();
    }
    public List<MedicationInPharmacyDtoExtend> getMedicationsByPharmacyId(Long pharmacyId) {
        return storageRepo.findMedicationsByPharmacyId(pharmacyId);
    }

}
