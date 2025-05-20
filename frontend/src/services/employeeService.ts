import { api } from './api';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto } from '../types/employee';

export const employeeService = {
  search: async (name: string = ''): Promise<Employee[]> => {
    const { data } = await api.get<Employee[]>('/employees', { params: { name } });
    return data;
  },

  get: async (id: number): Promise<Employee> => {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },

  create: async (employee: EmployeeCreateDto): Promise<Employee> => {
    const { data } = await api.post<Employee>('/employees', employee);
    return data;
  },

  update: async (id: number, employee: EmployeeUpdateDto): Promise<Employee> => {
    const { data } = await api.put<Employee>(`/employees/${id}`, employee);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};