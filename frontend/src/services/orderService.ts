import {
	Order,
	OrderCreateDto,
	OrderDetails,
	OrderFilterDto,
	OrderStatusDto,
	OrderStatusUpdateDto,
} from '../types/order'
import { api } from './api'

export const orderService = {
	filter: async (filterDto: OrderFilterDto): Promise<Order[]> => {
		const { data } = await api.post<Order[]>('/orders/filter', filterDto)
		return data
	},

	get: async (id: number): Promise<OrderDetails> => {
		const { data } = await api.get<OrderDetails>(`/orders/${id}`)
		return data
	},

	create: async (order: OrderCreateDto): Promise<void> => {
		await api.post('/orders', order)
	},

	updateStatus: async (
		id: number,
		statusUpdate: OrderStatusUpdateDto
	): Promise<void> => {
		await api.put(`/orders/${id}/status`, statusUpdate)
	},

	getStatuses: async (): Promise<OrderStatusDto[]> => {
		const { data } = await api.get<OrderStatusDto[]>('/order-statuses/dict')
		return data
	},
}
