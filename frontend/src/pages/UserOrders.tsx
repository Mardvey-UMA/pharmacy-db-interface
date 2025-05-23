import { useQuery } from '@tanstack/react-query'
import { Button, Card, Modal, Space, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import OrderForm from '../components/orders/OrderForm'
import { useCreateOrder } from '../hooks/useOrders'
import { OrderDto, ordersService } from '../services/orders'
import type { OrderCreateDto } from '../types/order'

const { Title } = Typography

export default function UserOrders() {
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const createMutation = useCreateOrder()

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
			render: (status: string) => {
				const statusColors: Record<string, string> = {
					сборка: 'blue',
					обработка: 'orange',
					доставка: 'purple',
					выполнен: 'green',
					отменен: 'red',
				}
				return (
					<span style={{ color: statusColors[status] || 'gray' }}>
						{status}
					</span>
				)
			},
		},
		{
			title: 'Адрес доставки',
			dataIndex: 'orderAddress',
			key: 'orderAddress',
		},
		{
			title: 'Сумма',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => `${total.toFixed(2)} ₽`,
		},
	]

	const handleCreateOrder = async (values: OrderCreateDto) => {
		await createMutation.mutateAsync(values)
		setIsCreateModalVisible(false)
	}

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
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Title level={2}>Мои заказы</Title>
					<Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
						Новый заказ
					</Button>
				</div>
				<Table
					dataSource={orders}
					columns={columns}
					rowKey='id'
					pagination={{ pageSize: 10 }}
					expandable={{
						expandedRowRender: (record: OrderDto) => (
							<div style={{ padding: '20px' }}>
								<p>
									<strong>ID заказа:</strong> {record.id}
								</p>
								<p>
									<strong>Товары:</strong>
								</p>
								<ul>
									{record.medications.map(item => (
										<li key={item.medicationId}>
											{item.medicationName} - {item.quantity} шт. (
											{item.price.toFixed(2)} ₽)
										</li>
									))}
								</ul>
							</div>
						),
					}}
				/>
			</Space>

			<Modal
				title='Создать новый заказ'
				open={isCreateModalVisible}
				onCancel={() => setIsCreateModalVisible(false)}
				width={800}
				footer={null}
			>
				<OrderForm
					onSubmit={handleCreateOrder}
					loading={createMutation.isPending}
					isUserMode={true}
				/>
			</Modal>
		</Card>
	)
}
