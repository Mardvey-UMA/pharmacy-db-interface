import { useQuery } from '@tanstack/react-query'
import { Card, Space, Spin, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { Medication, ordersService } from '../services/orders'

const { Title } = Typography

const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case 'доставка':
			return 'processing'
		case 'выполнен':
			return 'success'
		case 'отменен':
			return 'error'
		default:
			return 'default'
	}
}

export default function UserOrders() {
	const { data: orders, isLoading } = useQuery({
		queryKey: ['userOrders'],
		queryFn: ordersService.getUserOrders,
	})

	const columns = [
		{
			title: 'Дата заказа',
			dataIndex: 'orderDate',
			key: 'orderDate',
			render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
			),
		},
		{
			title: 'Адрес доставки',
			dataIndex: 'orderAddress',
			key: 'orderAddress',
		},
		{
			title: 'Товары',
			dataIndex: 'medications',
			key: 'medications',
			render: (medications: Medication[]) => (
				<ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
					{medications.map(medication => (
						<li key={medication.medicationId}>
							{medication.medicationName} - {medication.quantity} шт. (
							{medication.price} ₽)
						</li>
					))}
				</ul>
			),
		},
		{
			title: 'Сумма',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => `${total.toFixed(2)} ₽`,
		},
	]

	if (isLoading) {
		return (
			<div
				style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
			>
				<Spin size='large' />
			</div>
		)
	}

	return (
		<Card>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<Title level={2}>Мои заказы</Title>
				<Table
					dataSource={orders}
					columns={columns}
					rowKey='id'
					pagination={{ pageSize: 10 }}
					expandable={{
						expandedRowRender: record => (
							<div style={{ padding: '20px' }}>
								<p>
									<strong>Получатель:</strong> {record.clientName}
								</p>
								<p>
									<strong>ID заказа:</strong> {record.id}
								</p>
								<p>
									<strong>ID клиента:</strong> {record.clientId}
								</p>
							</div>
						),
					}}
				/>
			</Space>
		</Card>
	)
}
