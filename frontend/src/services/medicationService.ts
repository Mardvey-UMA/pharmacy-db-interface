import { MedicationInPharmacy } from '../types/medication'
import { api } from './api'

export const medicationService = {
	getByPharmacy: async (
		pharmacyId: number
	): Promise<MedicationInPharmacy[]> => {
		const { data } = await api.get<MedicationInPharmacy[]>(
			`/pharmacies/${pharmacyId}/medications`
		)
		return data
	},
}
