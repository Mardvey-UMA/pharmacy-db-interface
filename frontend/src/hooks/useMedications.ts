import { useQuery } from '@tanstack/react-query'
import { medicationService } from '../services/medicationService'

export const useMedications = (pharmacyId: number | null) => {
	return useQuery({
		queryKey: ['medications', pharmacyId],
		queryFn: () => medicationService.getByPharmacy(pharmacyId!),
		enabled: !!pharmacyId,
	})
}
