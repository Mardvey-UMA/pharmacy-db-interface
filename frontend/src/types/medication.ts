export interface Medication {
	id: number
	name: string
	form: string
	activeSubstance: string
	expirationDate: string
	requiresPrescription: boolean
}

export interface MedicationInPharmacy {
	id: number
	name: string
	form: string
	price: number
	quantity: number
	activeSubstance: string
	expirationDate: string
	pharmacyId: number
	requiresPrescription: boolean
}
