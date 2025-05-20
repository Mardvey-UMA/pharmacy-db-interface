package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.service.VendorService;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService service;

    @GetMapping("/dict")
    public List<SimpleDictDto> getVendors() {
        return service.getVendors();
    }
}
