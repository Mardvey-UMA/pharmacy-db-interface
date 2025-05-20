import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';
import { EmployeeCreateDto, EmployeeUpdateDto } from '../types/employee';
import { notification } from 'antd';

export const useEmployees = (searchTerm: string = '') => {
  return useQuery({
    queryKey: ['employees', searchTerm],
    queryFn: () => employeeService.search(searchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.get(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: EmployeeCreateDto) => employeeService.create(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      notification.success({
        message: 'Success',
        description: 'Employee created successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create employee',
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateDto }) => 
      employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      notification.success({
        message: 'Success',
        description: 'Employee updated successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update employee',
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      notification.success({
        message: 'Success',
        description: 'Employee deleted successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to delete employee',
      });
    },
  });
};