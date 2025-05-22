import { Button, Card, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { RegisterRequestDto } from '../types/auth'

export default function Register() {
	const navigate = useNavigate()

	const onFinish = async (values: RegisterRequestDto) => {
		try {
			const response = await authService.register(values)
			authService.setAuthData(response)
			message.success('Успешная регистрация')
			navigate('/')
		} catch (error) {
			message.error('Ошибка при регистрации')
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<Card title='Регистрация' style={{ width: 400 }}>
				<Form name='register' onFinish={onFinish} layout='vertical'>
					<Form.Item
						label='ФИО'
						name='fullName'
						rules={[{ required: true, message: 'Введите ФИО' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Имя пользователя'
						name='username'
						rules={[{ required: true, message: 'Введите имя пользователя' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Пароль'
						name='password'
						rules={[{ required: true, message: 'Введите пароль' }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' block>
							Зарегистрироваться
						</Button>
					</Form.Item>

					<Button type='link' block onClick={() => navigate('/login')}>
						Уже есть аккаунт? Войти
					</Button>
				</Form>
			</Card>
		</div>
	)
}
