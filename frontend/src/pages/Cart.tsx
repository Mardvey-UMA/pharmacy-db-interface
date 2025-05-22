import { Card, Typography } from 'antd'

const { Title } = Typography

export default function Cart() {
	return (
		<Card>
			<Title level={2}>Корзина</Title>
			<p>Здесь будет содержимое корзины пользователя</p>
		</Card>
	)
}
