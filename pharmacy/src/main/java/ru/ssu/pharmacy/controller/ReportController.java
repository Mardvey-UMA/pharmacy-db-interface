package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.report.EmployeesReportDto;
import ru.ssu.pharmacy.dto.report.MedicationsReportDto;
import ru.ssu.pharmacy.dto.report.ReportFilterDto;
import ru.ssu.pharmacy.dto.report.SalesReportDto;
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

    @PostMapping("/sales")
    public SalesReportDto getSalesReport(@RequestBody ReportFilterDto filter) {
        return reportService.generateSalesReport(filter);
    }

    @PostMapping("/medications")
    public MedicationsReportDto getMedicationsReport(@RequestBody ReportFilterDto filter) {
        return reportService.generateMedicationsReport(filter);
    }

    @PostMapping("/employees")
    public EmployeesReportDto getEmployeesReport(@RequestBody ReportFilterDto filter) {
        return reportService.generateEmployeesReport(filter);
    }
}

