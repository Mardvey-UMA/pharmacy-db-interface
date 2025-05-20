import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleService } from '../services/saleService';
import { SaleFilterDto, SaleRequest } from '../types/sale';
import { notification } from 'antd';

export const useSales = (filter: SaleFilterDto) => {
  return useQuery({
    queryKey: ['sales', filter],
    queryFn: () => saleService.filter(filter),
  });
};

export const useSaleDetails = (id: number) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: () => saleService.get(id),
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sale: SaleRequest) => saleService.create(sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      notification.success({
        message: 'Success',
        description: 'Sale created successfully',
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create sale',
      });
    },
  });
};