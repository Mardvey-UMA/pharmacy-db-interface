package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.ssu.pharmacy.dto.client.ClientDto;
import ru.ssu.pharmacy.dto.client.ClientUpdateDto;
import ru.ssu.pharmacy.dto.order.OrderDetailsDto;
import ru.ssu.pharmacy.dto.order.OrderDto;
import ru.ssu.pharmacy.dto.order.OrderFilterDto;
import ru.ssu.pharmacy.dto.sales.SaleDto;
import ru.ssu.pharmacy.entity.Client;
import ru.ssu.pharmacy.entity.DiscontCard;
import ru.ssu.pharmacy.entity.Sale;
import ru.ssu.pharmacy.repository.ClientRepository;
import ru.ssu.pharmacy.repository.DiscontCardRepository;
import ru.ssu.pharmacy.repository.SaleRepository;
import ru.ssu.pharmacy.service.OrderService;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientRepository clientRepository;
    private final DiscontCardRepository discontCardRepository;
    private final SaleRepository saleRepository;
    private final OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<ClientDto> getClient(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));
        return ResponseEntity.ok(ClientDto.from(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDto> updateClient(
            @PathVariable Long id,
            @RequestBody ClientUpdateDto dto
    ) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        if (!client.getUsername().equals(dto.username()) &&
                clientRepository.existsByUsername(dto.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        client.setFullName(dto.fullName());
        client.setUsername(dto.username());
        clientRepository.save(client);

        return ResponseEntity.ok(ClientDto.from(client));
    }

    @GetMapping("/{id}/discount")
    public ResponseEntity<BigDecimal> getDiscount(@PathVariable Long id) {
        DiscontCard card = discontCardRepository.findByClientId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Discount card not found"));
        return ResponseEntity.ok(card.getDiscount());
    }

    @GetMapping("/{id}/orders")
    public List<OrderDetailsDto> getClientOrders(@PathVariable Long id) {
        return orderService.getClientOrdersWithDetails(id);
    }

    @GetMapping("/{id}/sales")
    public List<SaleDto> getClientSales(@PathVariable Long id) {
        List<Sale> sales = saleRepository.findByDiscontCardClientId(id);
        return sales.stream()
                .map(s -> new SaleDto(
                        s.getId(),
                        s.getSaleDate(),
                        s.getSaleTime(),
                        s.getEmployee() != null ? s.getEmployee().getFullName() : null,
                        s.getDiscontCard() != null ? s.getDiscontCard().getClient().getFullName() : null,
                        s.getSaleMedications().stream()
                                .map(sm -> sm.getPrice().multiply(BigDecimal.valueOf(sm.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .collect(Collectors.toList());
    }
}
