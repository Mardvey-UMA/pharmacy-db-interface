import { Card, Typography } from 'antd'
import { authService } from '../services/auth'

const { Title, Text } = Typography

const Profile: React.FC = () => {
	const user = authService.getAuthData()

	return (
		<Card>
			<Title level={2}>Личный кабинет</Title>
			<div className='space-y-4'>
				<div>
					<Text strong>ID пользователя: </Text>
					<Text>{user?.userId}</Text>
				</div>
				<div>
					<Text strong>Имя пользователя: </Text>
					<Text>{user?.username}</Text>
				</div>
				<div>
					<Text strong>Роль: </Text>
					<Text>
						{user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
					</Text>
				</div>
				<div>
					<Text strong>ID скидочной карты: </Text>
					<Text>{user?.discountCardId}</Text>
				</div>
				<div>
					<Text strong>Размер скидки: </Text>
					<Text>{user?.discount}%</Text>
				</div>
			</div>
		</Card>
	)
}

export default Profile
