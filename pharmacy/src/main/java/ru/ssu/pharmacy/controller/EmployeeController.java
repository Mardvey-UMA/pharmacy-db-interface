package ru.ssu.pharmacy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ssu.pharmacy.dto.employee.EmployeeCreateDto;
import ru.ssu.pharmacy.dto.employee.EmployeeDeleteResponseDto;
import ru.ssu.pharmacy.dto.employee.EmployeeDto;
import ru.ssu.pharmacy.dto.employee.EmployeeUpdateDto;
import ru.ssu.pharmacy.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public List<EmployeeDto> search(@RequestParam(defaultValue = "") String name) {
        return employeeService.searchEmployees(name);
    }

    @GetMapping("/{id}")
    public EmployeeDto get(@PathVariable Long id) {
        return employeeService.getById(id);
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> create(@RequestBody EmployeeCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(dto));
    }

    @PutMapping("/{id}")
    public EmployeeDto update(@PathVariable Long id, @RequestBody EmployeeUpdateDto dto) {
        return employeeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            EmployeeDeleteResponseDto result = employeeService.delete(id);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

}

