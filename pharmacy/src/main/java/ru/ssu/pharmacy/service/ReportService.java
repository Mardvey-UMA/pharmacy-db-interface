package ru.ssu.pharmacy.service;

import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.report.EmployeesReportDto;
import ru.ssu.pharmacy.dto.report.MedicationsReportDto;
import ru.ssu.pharmacy.dto.report.ReportFilterDto;
import ru.ssu.pharmacy.dto.report.SalesReportDto;
import ru.ssu.pharmacy.dto.storage.StorageDto;
import ru.ssu.pharmacy.entity.*;
import ru.ssu.pharmacy.repository.PharmacyRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    @PersistenceContext
    private EntityManager em;
    private final PharmacyRepository pharmacyRepository;

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
    public SalesReportDto generateSalesReport(ReportFilterDto filter) {
        Long totalSales = getTotalSales(filter);
        BigDecimal totalRevenue = getTotalRevenue(filter);
        BigDecimal averageCheck = calculateAverageCheck(totalSales, totalRevenue);
        List<SalesReportDto.TopMedicationDto> topMedications = getTopMedications(filter);
        List<SalesReportDto.SalesByDayDto> salesByDay = getSalesByDay(filter);

        return new SalesReportDto(
                totalSales,
                totalRevenue,
                averageCheck,
                topMedications,
                salesByDay
        );
    }

    public MedicationsReportDto generateMedicationsReport(ReportFilterDto filter) {
        Long totalMedications = getTotalMedications(filter);
        List<MedicationsReportDto.LowStockMedicationDto> lowStock = getLowStockMedications(filter);
        List<MedicationsReportDto.ExpiringMedicationDto> expiring = getExpiringMedications(filter);
        List<MedicationsReportDto.TopMedicationQuantityDto> topMedications = getTopMedicationsQuantity(filter);

        return new MedicationsReportDto(
                totalMedications,
                lowStock,
                expiring,
                topMedications
        );
    }

    public EmployeesReportDto generateEmployeesReport(ReportFilterDto filter) {
        Long totalEmployees = getTotalEmployees(filter);
        List<EmployeesReportDto.EmployeesByPositionDto> byPosition = getEmployeesByPosition(filter);
        List<EmployeesReportDto.TopEmployeeDto> topEmployees = getTopEmployees(filter);
        List<EmployeesReportDto.EmployeesByPharmacyDto> byPharmacy = getEmployeesByPharmacy(filter);

        return new EmployeesReportDto(
                totalEmployees,
                byPosition,
                topEmployees,
                byPharmacy
        );
    }

    private Long getTotalSales(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Sale> sale = cq.from(Sale.class);

        List<Predicate> predicates = buildSalesPredicates(filter, cb, sale);

        cq.select(cb.count(sale)).where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getSingleResult();
    }

    private BigDecimal getTotalRevenue(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<BigDecimal> cq = cb.createQuery(BigDecimal.class);
        Root<SaleMedication> sm = cq.from(SaleMedication.class);

        List<Predicate> predicates = buildSaleMedicationPredicates(filter, cb, sm);

        cq.select(cb.sum(cb.prod(sm.get("quantity"), sm.get("price"))))
                .where(predicates.toArray(new Predicate[0]));

        BigDecimal result = em.createQuery(cq).getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    private List<SalesReportDto.TopMedicationDto> getTopMedications(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<SalesReportDto.TopMedicationDto> cq = cb.createQuery(SalesReportDto.TopMedicationDto.class);
        Root<SaleMedication> sm = cq.from(SaleMedication.class);
        Join<SaleMedication, Medication> m = sm.join("medication");
        Join<SaleMedication, Sale> s = sm.join("sale");

        List<Predicate> predicates = buildSaleMedicationPredicates(filter, cb, sm);

        cq.multiselect(
                        m.get("medicationName"),
                        cb.sum(sm.get("quantity")),
                        cb.sum(cb.prod(sm.get("quantity"), sm.get("price")))
                )
                .where(predicates.toArray(new Predicate[0]))
                .groupBy(m.get("medicationName"))
                .orderBy(cb.desc(cb.sum(sm.get("quantity"))));

        return em.createQuery(cq).setMaxResults(5).getResultList();
    }

//    private List<SalesReportDto.SalesByDayDto> getSalesByDay(ReportFilterDto filter) {
//        CriteriaBuilder cb = em.getCriteriaBuilder();
//        CriteriaQuery<SalesReportDto.SalesByDayDto> cq = cb.createQuery(SalesReportDto.SalesByDayDto.class);
//        Root<Sale> s = cq.from(Sale.class);
//        Join<Sale, SaleMedication> sm = s.join("saleMedications");
//
//        List<Predicate> predicates = buildSalesPredicates(filter, cb, s);
//
//        cq.multiselect(
//                        s.get("saleDate").as(String.class),
//                        cb.sum(sm.get("quantity")),
//                        cb.sum(cb.prod(sm.get("quantity"), sm.get("price")))
//                )
//                .where(predicates.toArray(new Predicate[0]))
//                .groupBy(s.get("saleDate"))
//                .orderBy(cb.asc(s.get("saleDate")));
//
//        return em.createQuery(cq).getResultList();
//    }

    private List<SalesReportDto.SalesByDayDto> getSalesByDay(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<SalesReportDto.SalesByDayDto> cq = cb.createQuery(SalesReportDto.SalesByDayDto.class);
        Root<Sale> sale = cq.from(Sale.class);
        Join<Sale, SaleMedication> sm = sale.join("saleMedications");

        List<Predicate> predicates = new ArrayList<>();

        if (filter.pharmacyId() != null) {
            predicates.add(cb.equal(
                    sale.get("employee").get("pharmacy").get("id"),
                    filter.pharmacyId()
            ));
        }

        if (filter.fromDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                    sale.get("saleDate"),
                    filter.fromDate()
            ));
        }

        if (filter.toDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(
                    sale.get("saleDate"),
                    filter.toDate()
            ));
        }

        cq.multiselect(
                        sale.get("saleDate"),
                        cb.sum(sm.get("quantity")),
                        cb.sum(cb.prod(sm.get("quantity"), sm.get("price")))
                )
                .where(predicates.toArray(new Predicate[0]))
                .groupBy(sale.get("saleDate"))
                .orderBy(cb.asc(sale.get("saleDate")));

        return em.createQuery(cq).getResultList();
    }

    private List<Predicate> buildSalesPredicates(ReportFilterDto filter, CriteriaBuilder cb, Root<? extends Sale> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (filter.pharmacyId() != null) {
            predicates.add(cb.equal(
                    root.get("employee").get("pharmacy").get("id"),
                    filter.pharmacyId()
            ));
        }
        addDatePredicates(filter, cb, root.get("saleDate"), predicates);

        return predicates;
    }

    private List<Predicate> buildSaleMedicationPredicates(ReportFilterDto filter, CriteriaBuilder cb, Root<SaleMedication> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (filter.pharmacyId() != null) {
            predicates.add(cb.equal(
                    root.get("sale").get("employee").get("pharmacy").get("id"),
                    filter.pharmacyId()
            ));
        }
        addDatePredicates(filter, cb, root.get("sale").get("saleDate"), predicates);

        return predicates;
    }

    private void addDatePredicates(ReportFilterDto filter, CriteriaBuilder cb, Path<LocalDate> datePath, List<Predicate> predicates) {
        if (filter.fromDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(datePath, filter.fromDate()));
        }
        if (filter.toDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(datePath, filter.toDate()));
        }
    }

    // Методы для MedicationsReport
    private Long getTotalMedications(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Storage> s = cq.from(Storage.class);

        Predicate predicate = filter.pharmacyId() != null ?
                cb.equal(s.get("supply").get("pharmacy").get("id"), filter.pharmacyId()) :
                cb.conjunction();

        cq.select(cb.sum(s.get("quantity"))).where(predicate);
        return em.createQuery(cq).getSingleResult();
    }

    private List<MedicationsReportDto.LowStockMedicationDto> getLowStockMedications(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<MedicationsReportDto.LowStockMedicationDto> cq =
                cb.createQuery(MedicationsReportDto.LowStockMedicationDto.class);
        Root<Storage> s = cq.from(Storage.class);
        Join<Storage, Medication> m = s.join("medication");
        Join<Storage, Supply> sp = s.join("supply");

        Predicate predicate = cb.and(
                cb.lessThan(s.get("quantity"), 50),
                filter.pharmacyId() != null ?
                        cb.equal(sp.get("pharmacy").get("id"), filter.pharmacyId()) :
                        cb.conjunction()
        );

        cq.multiselect(
                m.get("medicationName"),
                s.get("quantity"),
                sp.get("pharmacy").get("pharmacyAddress")
        ).where(predicate);

        return em.createQuery(cq).getResultList();
    }

    private List<MedicationsReportDto.ExpiringMedicationDto> getExpiringMedications(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<MedicationsReportDto.ExpiringMedicationDto> cq =
                cb.createQuery(MedicationsReportDto.ExpiringMedicationDto.class);
        Root<Storage> s = cq.from(Storage.class);
        Join<Storage, Medication> m = s.join("medication");
        Join<Storage, Supply> sp = s.join("supply");

        Expression<LocalDate> currentDate = cb.localDate();
        Expression<LocalDate> endDate = cb.literal(LocalDate.now().plusDays(30));

        Predicate datePredicate = cb.between(
                s.get("expirationDate"),
                currentDate,
                endDate
        );

        Predicate pharmacyPredicate = filter.pharmacyId() != null
                ? cb.equal(sp.get("pharmacy").get("id"), filter.pharmacyId())
                : cb.conjunction();

        cq.multiselect(
                        m.get("medicationName"),
                        s.get("expirationDate").as(String.class),
                        s.get("quantity"),
                        sp.get("pharmacy").get("pharmacyAddress")
                )
                .where(cb.and(datePredicate, pharmacyPredicate));

        return em.createQuery(cq).getResultList();
    }

    private List<MedicationsReportDto.TopMedicationQuantityDto> getTopMedicationsQuantity(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<MedicationsReportDto.TopMedicationQuantityDto> cq =
                cb.createQuery(MedicationsReportDto.TopMedicationQuantityDto.class);
        Root<Storage> s = cq.from(Storage.class);
        Join<Storage, Medication> m = s.join("medication");
        Join<Storage, Supply> sp = s.join("supply");

        Predicate predicate = filter.pharmacyId() != null ?
                cb.equal(sp.get("pharmacy").get("id"), filter.pharmacyId()) :
                cb.conjunction();

        cq.multiselect(
                        m.get("medicationName"),
                        cb.sum(s.get("quantity")),
                        cb.countDistinct(sp.get("pharmacy"))
                )
                .where(predicate)
                .groupBy(m.get("medicationName"))
                .orderBy(cb.desc(cb.sum(s.get("quantity"))));

        return em.createQuery(cq).setMaxResults(5).getResultList();
    }

    // Методы для EmployeesReport
    private Long getTotalEmployees(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Employee> e = cq.from(Employee.class);

        Predicate predicate = filter.pharmacyId() != null ?
                cb.equal(e.get("pharmacy").get("id"), filter.pharmacyId()) :
                cb.conjunction();

        cq.select(cb.count(e)).where(predicate);
        return em.createQuery(cq).getSingleResult();
    }

    private List<EmployeesReportDto.EmployeesByPositionDto> getEmployeesByPosition(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<EmployeesReportDto.EmployeesByPositionDto> cq =
                cb.createQuery(EmployeesReportDto.EmployeesByPositionDto.class);
        Root<Employee> e = cq.from(Employee.class);
        Join<Employee, Position> p = e.join("position");

        Predicate predicate = filter.pharmacyId() != null ?
                cb.equal(e.get("pharmacy").get("id"), filter.pharmacyId()) :
                cb.conjunction();

        cq.multiselect(
                        p.get("positionDescription"),
                        cb.count(e)
                )
                .where(predicate)
                .groupBy(p.get("positionDescription"));

        return em.createQuery(cq).getResultList();
    }

    private List<EmployeesReportDto.TopEmployeeDto> getTopEmployees(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<EmployeesReportDto.TopEmployeeDto> cq =
                cb.createQuery(EmployeesReportDto.TopEmployeeDto.class);
        Root<Employee> e = cq.from(Employee.class);
        Join<Employee, Position> p = e.join("position");
        Join<Employee, Sale> s = e.join("sales", JoinType.LEFT);
        Join<Sale, SaleMedication> sm = s.join("saleMedications", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        if (filter.pharmacyId() != null) {
            predicates.add(cb.equal(e.get("pharmacy").get("id"), filter.pharmacyId()));
        }
        addDatePredicates(filter, cb, s.get("saleDate"), predicates);

        // Вычисляем общий доход с использованием COALESCE
        Expression<BigDecimal> totalSales = cb.sum(
                cb.prod(sm.get("quantity"), sm.get("price"))
        );
        Expression<BigDecimal> coalescedSales = cb.coalesce(
                totalSales,
                cb.literal(BigDecimal.ZERO)
        );

        cq.multiselect(
                        e.get("fullName"),
                        p.get("positionDescription"),
                        cb.count(s),
                        coalescedSales
                )
                .where(predicates.toArray(new Predicate[0]))
                .groupBy(e.get("id"), e.get("fullName"), p.get("positionDescription"))
                .orderBy(cb.desc(coalescedSales));

        return em.createQuery(cq).setMaxResults(5).getResultList();
    }

    private List<EmployeesReportDto.EmployeesByPharmacyDto> getEmployeesByPharmacy(ReportFilterDto filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<EmployeesReportDto.EmployeesByPharmacyDto> cq =
                cb.createQuery(EmployeesReportDto.EmployeesByPharmacyDto.class);
        Root<Employee> e = cq.from(Employee.class);
        Join<Employee, Pharmacy> p = e.join("pharmacy");

        Predicate predicate = filter.pharmacyId() != null ?
                cb.equal(p.get("id"), filter.pharmacyId()) :
                cb.conjunction();

        cq.multiselect(
                        p.get("pharmacyAddress"),
                        cb.count(e)
                )
                .where(predicate)
                .groupBy(p.get("pharmacyAddress"));

        return em.createQuery(cq).getResultList();
    }

    private BigDecimal calculateAverageCheck(Long totalSales, BigDecimal totalRevenue) {
        if (totalSales == 0) return BigDecimal.ZERO;
        return totalRevenue.divide(BigDecimal.valueOf(totalSales), 2, RoundingMode.HALF_UP);
    }
}

