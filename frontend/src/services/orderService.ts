import { api } from './api';
import { Order, OrderDetails, OrderFilterDto, OrderCreateDto, OrderStatusUpdateDto } from '../types/order';

export const orderService = {
  filter: async (filterDto: OrderFilterDto): Promise<Order[]> => {
    const { data } = await api.post<Order[]>('/api/orders/filter', filterDto);
    return data;
  },

  get: async (id: number): Promise<OrderDetails> => {
    const { data } = await api.get<OrderDetails>(`/api/orders/${id}`);
    return data;
  },

  create: async (order: OrderCreateDto): Promise<void> => {
    await api.post('/api/orders', order);
  },

  updateStatus: async (id: number, statusUpdate: OrderStatusUpdateDto): Promise<void> => {
    await api.put(`/api/orders/${id}/status`, statusUpdate);
  },
};