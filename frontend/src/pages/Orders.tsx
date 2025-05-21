import {
	Button,
	DatePicker,
	Form,
	InputNumber,
	Modal,
	Select,
	Space,
	Table,
} from 'antd'
import { format } from 'date-fns'
import type { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import OrderDetails from '../components/orders/OrderDetails'
import OrderForm from '../components/orders/OrderForm'
import { useEmployees } from '../hooks/useEmployees'
import {
	useCreateOrder,
	useOrders,
	useOrderStatuses,
	useUpdateOrderStatus,
} from '../hooks/useOrders'
import type { Order, OrderCreateDto, OrderFilterDto } from '../types/order'

const { RangePicker } = DatePicker

const getStatusColor = (status: string) => {
	switch (status) {
		case 'сборка':
			return 'bg-blue-100 text-blue-800'
		case 'обработка':
			return 'bg-yellow-100 text-yellow-800'
		case 'доставка':
			return 'bg-purple-100 text-purple-800'
		case 'выполнен':
			return 'bg-green-100 text-green-800'
		case 'отменен':
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

const Orders: React.FC = () => {
	const [filter, setFilter] = useState<OrderFilterDto>({})
	const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const [isStatusModalVisible, setIsStatusModalVisible] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	const { data: orders, isLoading } = useOrders(filter)
	const { data: statuses } = useOrderStatuses()
	const { data: employees } = useEmployees()
	const createMutation = useCreateOrder()
	const updateStatusMutation = useUpdateOrderStatus()

	const columns = [
		{
			title: 'Дата',
			dataIndex: 'orderDate',
			key: 'orderDate',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
			sorter: (a: Order, b: Order) =>
				new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const statusInfo = statuses?.find(s => s.code === status)
				return (
					<span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
						{statusInfo?.displayName || status}
					</span>
				)
			},
			filters: statuses?.map(status => ({
				text: status.displayName,
				value: status.code,
			})),
			onFilter: (value: string | number | boolean, record: Order) =>
				record.status === value,
		},
		{
			title: 'Клиент',
			dataIndex: 'clientName',
			key: 'clientName',
			sorter: (a: Order, b: Order) => a.clientName.localeCompare(b.clientName),
		},
		{
			title: 'Адрес',
			dataIndex: 'orderAddress',
			key: 'orderAddress',
		},
		{
			title: 'Сумма',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => `${total.toLocaleString('ru-RU')} ₽`,
			sorter: (a: Order, b: Order) => a.total - b.total,
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: unknown, record: Order) => (
				<Space>
					<Button type='link' onClick={() => setSelectedOrderId(record.id)}>
						Просмотр
					</Button>
					<Button
						type='link'
						onClick={() => {
							setSelectedOrder(record)
							setIsStatusModalVisible(true)
						}}
					>
						Изменить статус
					</Button>
				</Space>
			),
		},
	]

	const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
		if (dates) {
			setFilter({
				...filter,
				fromDate: dates[0].format('YYYY-MM-DD'),
				toDate: dates[1].format('YYYY-MM-DD'),
			})
		} else {
			const { fromDate, toDate, ...rest } = filter
			setFilter(rest)
		}
	}

	const handleStatusChange = (value: string | null) => {
		if (value) {
			setFilter({ ...filter, status: value })
		} else {
			const { status, ...rest } = filter
			setFilter(rest)
		}
	}

	const handleSumRangeChange = (type: 'min' | 'max', value: number | null) => {
		if (value !== null) {
			setFilter({ ...filter, [type === 'min' ? 'minSum' : 'maxSum']: value })
		} else {
			const newFilter = { ...filter }
			delete newFilter[type === 'min' ? 'minSum' : 'maxSum']
			setFilter(newFilter)
		}
	}

	const handleCreateOrder = async (values: OrderCreateDto) => {
		await createMutation.mutateAsync(values)
		setIsCreateModalVisible(false)
	}

	const handleUpdateStatus = async (values: {
		status: string
		courierId?: number
	}) => {
		if (selectedOrder) {
			await updateStatusMutation.mutateAsync({
				id: selectedOrder.id,
				data: {
					newStatus: values.status,
					courierId: values.courierId,
				},
			})
			setIsStatusModalVisible(false)
			setSelectedOrder(null)
		}
	}

	return (
		<div className='p-6'>
			<div className='flex justify-between mb-6'>
				<Space size='middle' direction='vertical' style={{ width: '100%' }}>
					<Space size='middle' style={{ width: '100%' }}>
						<RangePicker onChange={handleDateRangeChange} />
						<Select
							allowClear
							placeholder='Фильтр по статусу'
							style={{ width: 200 }}
							onChange={handleStatusChange}
						>
							{statuses?.map(status => (
								<Select.Option key={status.code} value={status.code}>
									{status.displayName}
								</Select.Option>
							))}
						</Select>
						<InputNumber
							placeholder='Мин. сумма'
							style={{ width: 120 }}
							onChange={value => handleSumRangeChange('min', value as number)}
						/>
						<InputNumber
							placeholder='Макс. сумма'
							style={{ width: 120 }}
							onChange={value => handleSumRangeChange('max', value as number)}
						/>
					</Space>
				</Space>
				<Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
					Новый заказ
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={orders}
				loading={isLoading}
				rowKey='id'
			/>

			<Modal
				title='Детали заказа'
				open={!!selectedOrderId}
				onCancel={() => setSelectedOrderId(null)}
				width={800}
				footer={null}
			>
				{selectedOrderId && <OrderDetails orderId={selectedOrderId} />}
			</Modal>

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
				/>
			</Modal>

			<Modal
				title='Изменить статус заказа'
				open={isStatusModalVisible}
				onCancel={() => {
					setIsStatusModalVisible(false)
					setSelectedOrder(null)
				}}
				footer={null}
			>
				<Form onFinish={handleUpdateStatus} layout='vertical'>
					<Form.Item
						name='status'
						label='Новый статус'
						rules={[
							{ required: true, message: 'Пожалуйста, выберите новый статус' },
						]}
					>
						<Select>
							{statuses?.map(status => (
								<Select.Option key={status.code} value={status.code}>
									{status.displayName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name='courierId' label='Назначить курьера'>
						<Select allowClear>
							{employees?.map(employee => (
								<Select.Option key={employee.id} value={employee.id}>
									{employee.fullName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={updateStatusMutation.isPending}
						>
							Обновить статус
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default Orders
