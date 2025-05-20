package ru.ssu.pharmacy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.repository.VendorRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepo;

    public List<SimpleDictDto> getVendors() {
        return vendorRepo.findAll().stream()
                .map(v -> new SimpleDictDto(v.getVendorDescription(), v.getId()))
                .toList();
    }
}
