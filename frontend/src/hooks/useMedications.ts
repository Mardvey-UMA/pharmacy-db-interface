import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { medicationService } from '../services/medicationService'
import type { Medication } from '../types/medication'

export const useMedications = (pharmacyId: number | null) => {
	return useQuery({
		queryKey: ['medications', pharmacyId],
		queryFn: async () => {
			console.log('Fetching medications for pharmacy:', pharmacyId)
			const result = await medicationService.getByPharmacy(pharmacyId!)
			console.log('Received medications:', result)
			return result
		},
		enabled: !!pharmacyId,
	})
}

export const useAllMedications = () => {
	return useQuery({
		queryKey: ['medications'],
		queryFn: () => medicationService.getAll(),
	})
}

export const useCreateMedication = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (medication: Omit<Medication, 'id'>) =>
			medicationService.create(medication),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medications'] })
		},
	})
}

export const useUpdateMedication = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			medication,
		}: {
			id: number
			medication: Partial<Medication>
		}) => medicationService.update(id, medication),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medications'] })
		},
	})
}

export const useDeleteMedication = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => medicationService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['medications'] })
		},
	})
}

export const useAddMedicationToPharmacy = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			pharmacyId,
			medicationId,
			quantity,
			price,
		}: {
			pharmacyId: number
			medicationId: number
			quantity: number
			price: number
		}) =>
			medicationService.addToPharmacy(
				pharmacyId,
				medicationId,
				quantity,
				price
			),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['medications', variables.pharmacyId],
			})
		},
	})
}

export const useUpdateMedicationInPharmacy = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			pharmacyId,
			medicationId,
			quantity,
			price,
		}: {
			pharmacyId: number
			medicationId: number
			quantity: number
			price: number
		}) =>
			medicationService.updateInPharmacy(
				pharmacyId,
				medicationId,
				quantity,
				price
			),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['medications', variables.pharmacyId],
			})
		},
	})
}

export const useRemoveMedicationFromPharmacy = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			pharmacyId,
			medicationId,
		}: {
			pharmacyId: number
			medicationId: number
		}) => medicationService.removeFromPharmacy(pharmacyId, medicationId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['medications', variables.pharmacyId],
			})
		},
	})
}
