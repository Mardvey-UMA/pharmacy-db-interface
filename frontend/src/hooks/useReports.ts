import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'
import { ReportFilterDto } from '../types/report'

export const useSalesReport = (filter: ReportFilterDto) => {
	return useQuery({
		queryKey: ['reports', 'sales', filter],
		queryFn: () => reportService.getSalesReport(filter),
	})
}

export const useMedicationsReport = (filter: ReportFilterDto) => {
	return useQuery({
		queryKey: ['reports', 'medications', filter],
		queryFn: () => reportService.getMedicationsReport(filter),
	})
}

export const useEmployeesReport = (filter: ReportFilterDto) => {
	return useQuery({
		queryKey: ['reports', 'employees', filter],
		queryFn: () => reportService.getEmployeesReport(filter),
	})
}
