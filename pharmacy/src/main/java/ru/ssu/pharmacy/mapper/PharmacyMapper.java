package ru.ssu.pharmacy.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.ssu.pharmacy.dto.pharmacy.PharmacyDto;
import ru.ssu.pharmacy.dto.sales.SaleDto;
import ru.ssu.pharmacy.dto.pharmacy.SupplyDto;
import ru.ssu.pharmacy.entity.Pharmacy;
import ru.ssu.pharmacy.entity.Sale;
import ru.ssu.pharmacy.entity.Supply;

@Mapper(componentModel = "spring")
public interface PharmacyMapper {
    PharmacyDto toDto(Pharmacy pharmacy);

    @Mapping(source = "vendor.vendorDescription", target = "vendorName")
    SupplyDto toDto(Supply supply);

    @Mapping(source = "employee.fullName", target = "employeeName")
    @Mapping(source = "discontCard.client.fullName", target = "clientName")
    SaleDto toDto(Sale sale);
}

