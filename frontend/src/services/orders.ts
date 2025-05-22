import axios from 'axios'
import { authService } from './auth'

const API_URL = 'http://localhost:8080/api'

export interface Medication {
	medicationId: number
	medicationName: string
	quantity: number
	price: number
}

export interface OrderDto {
	id: number
	orderAddress: string
	orderDate: string
	status: string
	clientId: number
	clientName: string
	total: number
	medications: Medication[]
}

export const ordersService = {
	async getUserOrders(): Promise<OrderDto[]> {
		const user = authService.getAuthData()
		if (!user) throw new Error('Пользователь не авторизован')

		const response = await axios.get(`${API_URL}/clients/${user.id}/orders`)
		return response.data
	},
}
