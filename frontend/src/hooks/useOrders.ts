import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { OrderFilterDto, OrderCreateDto, OrderStatusUpdateDto } from '../types/order';
import { notification } from 'antd';

export const useOrders = (filter: OrderFilterDto) => {
  return useQuery({
    queryKey: ['orders', filter],
    queryFn: () => orderService.filter(filter),
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.get(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: OrderCreateDto) => orderService.create(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notification.success({
        message: 'Success',
        description: 'Order created successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create order',
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderStatusUpdateDto }) =>
      orderService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notification.success({
        message: 'Success',
        description: 'Order status updated successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update order status',
      });
    },
  });
};