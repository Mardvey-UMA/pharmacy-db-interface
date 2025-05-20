package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.service.MedicationFormService;

import java.util.List;

@RestController
@RequestMapping("/api/medication-forms")
@RequiredArgsConstructor
public class MedicationFormController {

    private final MedicationFormService service;

    @GetMapping("/dict")
    public List<SimpleDictDto> getForms() {
        return service.getForms();
    }
}

