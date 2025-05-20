package ru.ssu.pharmacy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.repository.ActiveSubstanceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiveSubstanceService {

    private final ActiveSubstanceRepository activeSubstanceRepo;

    public List<SimpleDictDto> getCategories() {
        return activeSubstanceRepo.findAll().stream()
                .map(a -> new SimpleDictDto(a.getCategory(), a.getId()))
                .toList();
    }
}
