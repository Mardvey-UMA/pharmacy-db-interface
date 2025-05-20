import { useQuery } from '@tanstack/react-query'
import { positionService } from '../services/positionService'

export const usePositions = () => {
	return useQuery({
		queryKey: ['positions'],
		queryFn: () => positionService.getDictionary(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}
