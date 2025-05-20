import { useQuery } from '@tanstack/react-query';
import { pharmacyService } from '../services/pharmacyService';
import { useDebounce } from './useDebounce';

export const usePharmacies = (searchTerm: string = '') => {
  const debouncedSearch = useDebounce(searchTerm, 300);

  return useQuery({
    queryKey: ['pharmacies', debouncedSearch],
    queryFn: () => pharmacyService.search(debouncedSearch),
  });
};

export const usePharmacyDetails = (id: number, sort: string = 'expiration') => {
  return useQuery({
    queryKey: ['pharmacy', id, sort],
    queryFn: () => pharmacyService.get(id, sort),
    enabled: !!id,
  });
};