package ru.ssu.pharmacy.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.ssu.pharmacy.dto.employee.EmployeeCreateDto;
import ru.ssu.pharmacy.dto.employee.EmployeeDto;
import ru.ssu.pharmacy.entity.Employee;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    Employee toEntity(EmployeeCreateDto dto);

    @Mapping(source = "pharmacy.pharmacyAddress", target = "pharmacyAddress")
    @Mapping(source = "position.positionDescription", target = "positionDescription")
    @Mapping(target = "finalSalary", ignore = true)
    EmployeeDto toDto(Employee employee);
}

