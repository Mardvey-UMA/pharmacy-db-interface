export interface SalesReportItem {
	date: string
	totalQuantity: number
	totalRevenue: number
}

export interface SalesReport {
	totalSales: number
	totalRevenue: number
	averageCheck: number
	topMedications: {
		name: string
		quantity: number
		revenue: number
	}[]
	salesByDay: {
		date: string
		sales: number
		revenue: number
	}[]
}

export interface ReportFilterDto {
	reportType: 'sales' | 'medications' | 'employees'
	fromDate?: string
	toDate?: string
	pharmacyId?: number
}

export interface MedicationsReport {
	totalMedications: number
	lowStockMedications: {
		name: string
		quantity: number
		pharmacyAddress: string
	}[]
	expiringMedications: {
		name: string
		expirationDate: string
		quantity: number
		pharmacyAddress: string
	}[]
	topMedications: {
		name: string
		totalQuantity: number
		pharmaciesCount: number
	}[]
}

export interface EmployeesReport {
	totalEmployees: number
	employeesByPosition: {
		position: string
		count: number
	}[]
	topEmployees: {
		name: string
		position: string
		salesCount: number
		totalRevenue: number
	}[]
	employeesByPharmacy: {
		pharmacyAddress: string
		employeeCount: number
	}[]
}
