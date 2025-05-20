package ru.ssu.pharmacy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.SimpleDictDto;
import ru.ssu.pharmacy.repository.PositionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepo;

    public List<SimpleDictDto> getPositionDict() {
        return positionRepo.findAll().stream()
                .map(p -> new SimpleDictDto(p.getPositionDescription(), p.getId()))
                .toList();
    }
}
