package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.service.ActiveSubstanceService;

import java.util.List;

@RestController
@RequestMapping("/api/active-substances")
@RequiredArgsConstructor
public class ActiveSubstanceController {

    private final ActiveSubstanceService service;

    @GetMapping("/dict")
    public List<SimpleDictDto> getCategories() {
        return service.getCategories();
    }
}
