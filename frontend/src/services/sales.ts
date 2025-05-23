import axios from 'axios'
import { authService } from './auth'

const API_URL = 'http://localhost:8080/api'

export interface SaleItem {
	medicationId: number
	medicationName: string
	quantity: number
	price: number
}

export interface SaleDto {
	id: number
	saleDate: string
	saleTime: string
	employeeName: string
	clientName: string
	total: number
	pharmacyName: string
	items: SaleItem[]
}

export const salesService = {
	async getUserSales(): Promise<SaleDto[]> {
		const user = authService.getAuthData()
		if (!user?.userId) {
			throw new Error('Пользователь не авторизован')
		}

		const response = await axios.get(`${API_URL}/clients/${user.userId}/sales`)
		return response.data
	},
}
