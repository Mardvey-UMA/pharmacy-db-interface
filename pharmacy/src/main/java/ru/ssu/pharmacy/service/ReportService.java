package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.storage.StorageDto;
import ru.ssu.pharmacy.entity.Storage;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    @PersistenceContext
    private EntityManager em;

    public BigDecimal getOrderTotal(Long orderId) {
        String sql = "SELECT calculate_order_total(:orderId)";
        BigDecimal total = (BigDecimal) em.createNativeQuery(sql)
                .setParameter("orderId", orderId)
                .getSingleResult();
        return total;
    }

    public List<StorageDto> getExpiringMedications(int days) {
        StoredProcedureQuery query = em.createStoredProcedureQuery("get_expiring_medications", Storage.class);
        query.registerStoredProcedureParameter(1, Integer.class, ParameterMode.IN);
        query.setParameter(1, days);

        List<Storage> results = query.getResultList();

        return results.stream()
                .map(s -> new StorageDto(
                        s.getId(),
                        s.getQuantity(),
                        s.getExpirationDate(),
                        s.getPurchasePrice(),
                        s.getSupply().getId(),
                        s.getMedication().getId()
                ))
                .toList();
    }
}

