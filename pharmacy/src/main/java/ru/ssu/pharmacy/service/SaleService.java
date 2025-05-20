package ru.ssu.pharmacy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.sales.MedicationShortDto;
import ru.ssu.pharmacy.dto.pharmacy.SaleDetailsDto;
import ru.ssu.pharmacy.dto.sales.SaleDto;
import ru.ssu.pharmacy.dto.sales.SaleFilterDto;
import ru.ssu.pharmacy.entity.Sale;
import ru.ssu.pharmacy.repository.SaleMedicationRepository;
import ru.ssu.pharmacy.repository.SaleRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepo;
    private final SaleMedicationRepository saleMedRepo;

    public List<SaleDto> filterSales(SaleFilterDto filter) {
        Specification<Sale> spec = Specification.where(null);

        if (filter.pharmacyId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("employee").get("pharmacy").get("id"), filter.pharmacyId()));
        }
        if (filter.from() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("saleDate"), filter.from()));
        }
        if (filter.to() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("saleDate"), filter.to()));
        }

        List<Sale> sales = saleRepo.findAll(spec, Sort.by(Sort.Direction.DESC, "saleDate", "saleTime"));

        return sales.stream()
                .map(sale -> new SaleDto(
                        sale.getId(),
                        sale.getSaleDate(),
                        sale.getSaleTime(),
                        sale.getEmployee() != null ? sale.getEmployee().getFullName() : null,
                        sale.getDiscontCard() != null ? sale.getDiscontCard().getClient().getFullName() : null,
                        calculateTotal(sale)
                ))
                .toList();
    }


    public SaleDetailsDto getDetails(Long id) {
        Sale sale = saleRepo.findById(id).orElseThrow();
        List<MedicationShortDto> items = saleMedRepo.findBySaleId(id).stream()
                .map(med -> new MedicationShortDto(
                        med.getMedication() != null ? med.getMedication().getMedicationName() : "Unknown",
                        med.getQuantity(),
                        med.getPrice()
                ))
                .toList();

        return new SaleDetailsDto(
                sale.getId(),
                sale.getSaleDate(),
                sale.getSaleTime(),
                sale.getEmployee() != null ? sale.getEmployee().getFullName() : null,
                sale.getDiscontCard() != null ? sale.getDiscontCard().getClient().getFullName() : null,
                calculateTotal(sale),
                items
        );
    }

    private BigDecimal calculateTotal(Sale sale) {
        return saleMedRepo.findBySaleId(sale.getId()).stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

