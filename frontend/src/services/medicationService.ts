import { Medication, MedicationInPharmacy } from '../types/medication'
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

	getAll: async (): Promise<Medication[]> => {
		const { data } = await api.get<Medication[]>('/medications')
		return data
	},

	create: async (medication: Omit<Medication, 'id'>): Promise<Medication> => {
		const { data } = await api.post<Medication>('/medications', medication)
		return data
	},

	update: async (
		id: number,
		medication: Partial<Medication>
	): Promise<Medication> => {
		const { data } = await api.put<Medication>(`/medications/${id}`, medication)
		return data
	},

	delete: async (id: number): Promise<void> => {
		await api.delete(`/medications/${id}`)
	},

	addToPharmacy: async (
		pharmacyId: number,
		medicationId: number,
		quantity: number,
		price: number
	): Promise<MedicationInPharmacy> => {
		const { data } = await api.post<MedicationInPharmacy>(
			`/pharmacies/${pharmacyId}/medications`,
			{
				medicationId,
				quantity,
				price,
			}
		)
		return data
	},

	updateInPharmacy: async (
		pharmacyId: number,
		medicationId: number,
		quantity: number,
		price: number
	): Promise<MedicationInPharmacy> => {
		const { data } = await api.put<MedicationInPharmacy>(
			`/pharmacies/${pharmacyId}/medications/${medicationId}`,
			{
				quantity,
				price,
			}
		)
		return data
	},

	removeFromPharmacy: async (
		pharmacyId: number,
		medicationId: number
	): Promise<void> => {
		await api.delete(`/pharmacies/${pharmacyId}/medications/${medicationId}`)
	},
}
