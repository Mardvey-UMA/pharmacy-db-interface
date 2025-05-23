import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import { employeeService } from '../services/employeeService'
import { EmployeeCreateDto, EmployeeUpdateDto } from '../types/employee'

export const useEmployees = () => {
	return useQuery({
		queryKey: ['employees'],
		queryFn: employeeService.getAll,
	})
}

export const useEmployee = (id: number) => {
	return useQuery({
		queryKey: ['employee', id],
		queryFn: () => employeeService.get(id),
		enabled: !!id,
	})
}

export const useCreateEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (employee: EmployeeCreateDto) =>
			employeeService.create(employee),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] })
			notification.success({
				message: 'Успех',
				description: 'Сотрудник успешно создан',
			})
		},
		onError: (error: Error) => {
			notification.error({
				message: 'Ошибка',
				description: error.message || 'Не удалось создать сотрудника',
			})
		},
	})
}

export const useUpdateEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateDto }) =>
			employeeService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] })
			notification.success({
				message: 'Успех',
				description: 'Сотрудник успешно обновлен',
			})
		},
		onError: (error: Error) => {
			notification.error({
				message: 'Ошибка',
				description: error.message || 'Не удалось обновить сотрудника',
			})
		},
	})
}

export const useDeleteEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => employeeService.delete(id),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['employees'] })
			notification.success({
				message: 'Успех',
				description: `Сотрудник ${data.deletedEmployeeName} успешно уволен`,
			})
		},
		onError: (error: Error) => {
			notification.error({
				message: 'Ошибка',
				description: error.message || 'Не удалось уволить сотрудника',
			})
		},
	})
}
