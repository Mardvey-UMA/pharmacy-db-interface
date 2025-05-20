package ru.ssu.pharmacy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ssu.pharmacy.dto.employee.EmployeeCreateDto;
import ru.ssu.pharmacy.dto.employee.EmployeeDto;
import ru.ssu.pharmacy.dto.employee.EmployeeUpdateDto;
import ru.ssu.pharmacy.entity.Employee;
import ru.ssu.pharmacy.mapper.EmployeeMapper;
import ru.ssu.pharmacy.repository.EmployeeRepository;
import ru.ssu.pharmacy.repository.PharmacyRepository;
import ru.ssu.pharmacy.repository.PositionRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepo;
    private final PharmacyRepository pharmacyRepo;
    private final PositionRepository positionRepo;
    private final EmployeeMapper employeeMapper;

    @PersistenceContext
    private EntityManager em;

    public List<EmployeeDto> searchEmployees(String name) {
        return employeeRepo.findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(emp -> {
                    EmployeeDto dto = employeeMapper.toDto(emp);
                    dto = new EmployeeDto(
                            dto.id(),
                            dto.fullName(),
                            dto.passport(),
                            dto.positionDescription(),
                            calculateFinalSalary(emp),
                            dto.pharmacyAddress()
                    );
                    return dto;
                })
                .toList();
    }

    public EmployeeDto getById(Long id) {
        return employeeRepo.findById(id)
                .map(emp -> {
                    EmployeeDto dto = employeeMapper.toDto(emp);
                    dto = new EmployeeDto(
                            dto.id(),
                            dto.fullName(),
                            dto.passport(),
                            dto.positionDescription(),
                            calculateFinalSalary(emp),
                            dto.pharmacyAddress()
                    );
                    return dto;
                }).orElseThrow();
    }

    public EmployeeDto create(EmployeeCreateDto dto) {
        Employee emp = employeeMapper.toEntity(dto);
        emp.setPharmacy(pharmacyRepo.findById(dto.pharmacyId()).orElseThrow());
        emp.setPosition(positionRepo.findById(dto.positionId()).orElseThrow());
        emp = employeeRepo.save(emp);
        return getById(emp.getId());
    }

    public EmployeeDto update(Long id, EmployeeUpdateDto dto) {
        Employee emp = employeeRepo.findById(id).orElseThrow();
        emp.setFullName(dto.fullName());
        emp.setPassport(dto.passport());
        emp.setPosition(positionRepo.findById(dto.positionId()).orElseThrow());
        return getById(employeeRepo.save(emp).getId());
    }

    public void delete(Long id) {
        employeeRepo.deleteById(id);
    }

    private BigDecimal calculateFinalSalary(Employee employee) {
        String sql = "SELECT * FROM get_employees_with_salary(:pharmacy_id)";
        List<Object[]> result = em.createNativeQuery(sql)
                .setParameter("pharmacy_id", employee.getPharmacy().getId().intValue())
                .getResultList();

        for (Object[] row : result) {
            if (Objects.equals(row[0], employee.getFullName())) {
                return (BigDecimal) row[2];
            }
        }
        return employee.getPosition().getSalary();
    }

}

