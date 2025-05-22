import { Card, Typography } from 'antd'
import { authService } from '../services/auth'

const { Title } = Typography

export default function Profile() {
	const user = authService.getAuthData()

	return (
		<Card>
			<Title level={2}>Личный кабинет</Title>
			<p>ID пользователя: {user?.id}</p>
			<p>Роль: {user?.role}</p>
		</Card>
	)
}
