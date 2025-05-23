import { Button, Card, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { LoginRequestDto } from '../types/auth'

export default function Login() {
	const navigate = useNavigate()

	const onFinish = async (values: LoginRequestDto) => {
		try {
			const response = await authService.login(values)
			authService.setAuthData(response)
			message.success('Успешная авторизация')
			navigate('/profile')
		} catch (error) {
			message.error('Ошибка при авторизации')
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
			<Card title='Вход в систему' style={{ width: 400 }}>
				<Form name='login' onFinish={onFinish} layout='vertical'>
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
							Войти
						</Button>
					</Form.Item>

					<Button type='link' block onClick={() => navigate('/register')}>
						Зарегистрироваться
					</Button>
				</Form>
			</Card>
		</div>
	)
}
