import { api } from './api';
import { Sale, SaleDetails, SaleFilterDto, SaleRequest } from '../types/sale';

export const saleService = {
  filter: async (filterDto: SaleFilterDto): Promise<Sale[]> => {
    const { data } = await api.post<Sale[]>('/sales/filter', filterDto);
    return data;
  },

  get: async (id: number): Promise<SaleDetails> => {
    const { data } = await api.get<SaleDetails>(`/sales/${id}`);
    return data;
  },

  create: async (saleRequest: SaleRequest): Promise<void> => {
    await api.post('/sale', saleRequest);
  },
};