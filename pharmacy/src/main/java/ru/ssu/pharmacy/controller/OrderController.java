package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.order.*;
import ru.ssu.pharmacy.entity.ClientOrder;
import ru.ssu.pharmacy.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/filter")
    public List<OrderDto> filter(@RequestBody OrderFilterDto filter) {
        return orderService.filterOrders(filter);
    }

    @GetMapping("/{id}")
    public OrderDetailsDto get(@PathVariable Long id) {
        return orderService.getOrderDetails(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrderCreateDto dto) {
        try {
            ClientOrder order = orderService.createOrder(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(order.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody OrderStatusUpdateDto dto) {
        try {
            orderService.updateOrderStatus(id, dto.newStatus(), dto.courierId());
            return ResponseEntity.ok("Статус заказа обновлен");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ошибка: " + e.getMessage());
        }
    }


}

