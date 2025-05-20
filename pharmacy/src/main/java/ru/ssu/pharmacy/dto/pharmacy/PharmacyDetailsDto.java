package ru.ssu.pharmacy.dto.pharmacy;

import ru.ssu.pharmacy.dto.employee.EmployeeDto;
import ru.ssu.pharmacy.dto.sales.SaleDto;

import java.util.List;

public record PharmacyDetailsDto(
        Long id,
        String pharmacyAddress,
        List<EmployeeDto> employees,
        List<SupplyDto> supplies,
        List<MedicationInPharmacyDto> medications,
        List<SaleDto> sales
) {}

