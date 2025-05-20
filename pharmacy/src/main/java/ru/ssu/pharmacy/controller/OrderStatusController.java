package ru.ssu.pharmacy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssu.pharmacy.dto.order.OrderStatusDto;
import ru.ssu.pharmacy.enums.OrderStatus;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-statuses")
public class OrderStatusController {

    @GetMapping("/dict")
    public List<OrderStatusDto> getStatuses() {
        return Arrays.stream(OrderStatus.values())
                .map(s -> new OrderStatusDto(s.name(), s.getDisplayName()))
                .collect(Collectors.toList());
    }
}
