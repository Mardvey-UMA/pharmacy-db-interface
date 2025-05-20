package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.storage.StorageDto;
import ru.ssu.pharmacy.service.ReportService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/order-total/{orderId}")
    public BigDecimal getOrderTotal(@PathVariable Long orderId) {
        return reportService.getOrderTotal(orderId);
    }

    @GetMapping("/expiring-medications")
    public List<StorageDto> getExpiringMedications(@RequestParam int days) {
        return reportService.getExpiringMedications(days);
    }
}

