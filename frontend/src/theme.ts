import type { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
	token: {
		colorPrimary: '#4CAF50',
		colorSuccess: '#81C784',
		colorWarning: '#FFB74D',
		colorError: '#E57373',
		colorInfo: '#64B5F6',
		borderRadius: 6,
		fontFamily:
			"'JetBrains Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
	},
	components: {
		Button: {
			algorithm: true,
			borderRadius: 4,
		},
		Input: {
			algorithm: true,
			borderRadius: 4,
		},
		Select: {
			algorithm: true,
			borderRadius: 4,
		},
	},
}
