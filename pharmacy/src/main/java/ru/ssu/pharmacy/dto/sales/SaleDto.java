package ru.ssu.pharmacy.dto.sales;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record SaleDto(
        Long id,
        LocalDate saleDate,
        LocalTime saleTime,
        String employeeName,
        String clientName,
        BigDecimal total,
        String pharmacyName,
        List<SaleItemDto> items
) {
    // Новый полный конструктор
    public SaleDto {
        items = items != null ? items : List.of();
    }

    // Статический фабричный метод для старой версии
    public static SaleDto createBasic(
            Long id,
            LocalDate saleDate,
            LocalTime saleTime,
            String employeeName,
            String clientName,
            BigDecimal total
    ) {
        return new SaleDto(
                id,
                saleDate,
                saleTime,
                employeeName,
                clientName,
                total,
                null,
                List.of()
        );
    }

    public record SaleItemDto(
            Long medicationId,
            String medicationName,
            Long quantity,
            BigDecimal price
    ) {}
}

