package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssu.pharmacy.dto.sales.SaleRequestDto;
import ru.ssu.pharmacy.service.SaleTransactionService;

@RestController
@RequestMapping("/api/sale")
@RequiredArgsConstructor
public class SaleTransactionController {

    private final SaleTransactionService saleTransactionService;

    @PostMapping
    public ResponseEntity<?> sell(@RequestBody SaleRequestDto dto) {
        try {
            saleTransactionService.processSale(dto);
            return ResponseEntity.ok("Продажа успешно завершена");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Ошибка: " + ex.getMessage());
        }
    }
}

