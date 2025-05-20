package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.pharmacy.SaleDetailsDto;
import ru.ssu.pharmacy.dto.sales.SaleDto;
import ru.ssu.pharmacy.dto.sales.SaleFilterDto;
import ru.ssu.pharmacy.service.SaleService;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @PostMapping("/filter")
    public List<SaleDto> filter(@RequestBody SaleFilterDto dto) {
        return saleService.filterSales(dto);
    }

    @GetMapping("/{id}")
    public SaleDetailsDto get(@PathVariable Long id) {
        return saleService.getDetails(id);
    }
}

