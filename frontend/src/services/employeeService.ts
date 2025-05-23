import {
	Employee,
	EmployeeCreateDto,
	EmployeeUpdateDto,
} from '../types/employee'
import { api } from './api'

export const employeeService = {
	getAll: async (): Promise<Employee[]> => {
		const { data } = await api.get<Employee[]>('/employees')
		return data
	},

	get: async (id: number): Promise<Employee> => {
		const { data } = await api.get<Employee>(`/employees/${id}`)
		return data
	},

	create: async (employee: EmployeeCreateDto): Promise<void> => {
		await api.post('/employees', employee)
	},

	update: async (id: number, employee: EmployeeUpdateDto): Promise<void> => {
		await api.put(`/employees/${id}`, employee)
	},

	delete: async (
		id: number
	): Promise<{
		deletedEmployeeId: number
		deletedEmployeeName: string
		pharmacyAddress: string
		positionDescription: string
		changes: Array<{
			entityType: 'ORDER' | 'SALE'
			entityId: number
			role: string
			newEmployeeId: number
			newEmployeeName: string
		}>
	}> => {
		const { data } = await api.delete(`/employees/${id}`)
		return data
	},
}
