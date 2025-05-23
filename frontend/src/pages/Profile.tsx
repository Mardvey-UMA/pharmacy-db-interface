import { Card, Descriptions, Space, Typography } from 'antd'
import { authService } from '../services/auth'

const { Title, Text } = Typography

const Profile: React.FC = () => {
	const user = authService.getAuthData()

	return (
		<Card>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<Title level={2}>Личный кабинет</Title>
				<Descriptions bordered>
					<Descriptions.Item label='Полное имя'>
						<Text>{user?.fullName}</Text>
					</Descriptions.Item>
					<Descriptions.Item label='Логин'>
						<Text>{user?.username}</Text>
					</Descriptions.Item>
					<Descriptions.Item label='Скидка'>
						<Text>{user?.discount}%</Text>
					</Descriptions.Item>
				</Descriptions>
			</Space>
		</Card>
	)
}

export default Profile
