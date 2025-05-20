package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.dto.pharmacy.MedicationInPharmacyDtoExtend;
import ru.ssu.pharmacy.dto.pharmacy.PharmacyDetailsDto;
import ru.ssu.pharmacy.dto.pharmacy.PharmacyDto;
import ru.ssu.pharmacy.service.PharmacyService;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService service;

    @GetMapping
    public List<PharmacyDto> search(@RequestParam(defaultValue = "") String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public PharmacyDetailsDto get(@PathVariable Long id,
                                  @RequestParam(defaultValue = "expiration") String sort) {
        return service.getDetails(id, sort);
    }

    @GetMapping("/dict")
    public List<SimpleDictDto> getPharmacyDictionary() {
        return service.getPharmacyDict();
    }

    @GetMapping("/{id}/medications")
    public List<MedicationInPharmacyDtoExtend> getMedications(@PathVariable("id") Long pharmacyId) {
        return service.getMedicationsByPharmacyId(pharmacyId);
    }

}

