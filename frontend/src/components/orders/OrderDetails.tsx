import { Descriptions, Empty, Spin, Table, Tag } from 'antd'
import { format } from 'date-fns'
import React from 'react'
import { useOrderDetails } from '../../hooks/useOrders'
import type { OrderMedication } from '../../types/order'

interface OrderDetailsProps {
	orderId: number
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
	const { data: order, isLoading, error } = useOrderDetails(orderId)

	if (isLoading) {
		return <Spin size='large' className='flex justify-center p-8' />
	}

	if (error || !order) {
		return <Empty description='Не удалось загрузить детали заказа' />
	}

	const columns = [
		{
			title: 'Лекарство',
			dataIndex: 'medicationName',
			key: 'medicationName',
		},
		{
			title: 'Количество',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Цена',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toFixed(2)} ₽`,
		},
		{
			title: 'Итого',
			key: 'total',
			render: (_, record: OrderMedication) =>
				`${(record.price * record.quantity).toFixed(2)} ₽`,
		},
	]

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'сборка':
				return 'blue'
			case 'обработка':
				return 'orange'
			case 'доставка':
				return 'purple'
			case 'выполнен':
				return 'green'
			case 'отменен':
				return 'red'
			default:
				return 'default'
		}
	}

	return (
		<div className='space-y-6'>
			<Descriptions title='Информация о заказе' bordered>
				<Descriptions.Item label='Дата заказа'>
					{format(new Date(order.orderDate), 'dd.MM.yyyy')}
				</Descriptions.Item>
				<Descriptions.Item label='Статус'>
					<Tag color={getStatusColor(order.status)}>{order.status}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Клиент'>{order.clientName}</Descriptions.Item>
				<Descriptions.Item label='Адрес'>
					{order.orderAddress}
				</Descriptions.Item>
				<Descriptions.Item label='Итого'>
					{order.total.toFixed(2)} ₽
				</Descriptions.Item>
			</Descriptions>

			<Table
				title={() => <h3 className='text-lg font-semibold'>Товары</h3>}
				columns={columns}
				dataSource={order.medications}
				rowKey='id'
				pagination={false}
				summary={data => {
					const total = data.reduce(
						(sum, item) => sum + item.price * item.quantity,
						0
					)
					return (
						<Table.Summary.Row>
							<Table.Summary.Cell index={0} colSpan={3}>
								<strong>Итого</strong>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1}>
								<strong>{total.toFixed(2)} ₽</strong>
							</Table.Summary.Cell>
						</Table.Summary.Row>
					)
				}}
			/>
		</div>
	)
}

export default OrderDetails
