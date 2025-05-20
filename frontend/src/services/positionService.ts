import { PositionDict } from '../types/position'
import { api } from './api'

export const positionService = {
	getDictionary: async (): Promise<PositionDict[]> => {
		const { data } = await api.get<PositionDict[]>('/positions/dict')
		return data
	},
}
