import { Pharmacy, PharmacyDetails } from '../types/pharmacy'
import { api } from './api'

export const pharmacyService = {
	search: async (query: string = ''): Promise<Pharmacy[]> => {
		const { data } = await api.get<Pharmacy[]>('/pharmacies', {
			params: { q: query },
		})
		return data
	},

	get: async (
		id: number,
		sort: string = 'expiration'
	): Promise<PharmacyDetails> => {
		const { data } = await api.get<PharmacyDetails>(`/pharmacies/${id}`, {
			params: { sort },
		})
		return data
	},

	getDictionary: async (): Promise<{ [key: string]: number }> => {
		const { data } = await api.get<{ [key: string]: number }>(
			'/pharmacies/dict'
		)
		return data
	},
}
