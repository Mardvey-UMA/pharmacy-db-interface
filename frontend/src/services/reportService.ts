import {
	EmployeesReport,
	MedicationsReport,
	ReportFilterDto,
	SalesReport,
} from '../types/report'
import { api } from './api'

export const reportService = {
	getSalesReport: async (filter: ReportFilterDto): Promise<SalesReport> => {
		const { data } = await api.post<SalesReport>('/reports/sales', filter)
		return data
	},

	getMedicationsReport: async (
		filter: ReportFilterDto
	): Promise<MedicationsReport> => {
		const { data } = await api.post<MedicationsReport>(
			'/reports/medications',
			filter
		)
		return data
	},

	getEmployeesReport: async (
		filter: ReportFilterDto
	): Promise<EmployeesReport> => {
		const { data } = await api.post<EmployeesReport>(
			'/reports/employees',
			filter
		)
		return data
	},
}
