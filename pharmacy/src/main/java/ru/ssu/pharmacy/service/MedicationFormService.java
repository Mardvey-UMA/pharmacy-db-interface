package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.SimpleDictDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationFormService {

    private final EntityManager em;

    public List<SimpleDictDto> getForms() {
        List<String> forms = em.createQuery(
                        "SELECT DISTINCT m.form FROM Medication m", String.class)
                .getResultList();

        return forms.stream()
                .map(f -> new SimpleDictDto(f, null)) // id нет, можно null
                .toList();
    }
}

