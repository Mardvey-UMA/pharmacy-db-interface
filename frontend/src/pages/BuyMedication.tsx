import { Card, Typography } from 'antd'

const { Title } = Typography

export default function BuyMedication() {
	return (
		<Card>
			<Title level={2}>Купить лекарство</Title>
			<p>Здесь будет каталог лекарств для покупки</p>
		</Card>
	)
}
