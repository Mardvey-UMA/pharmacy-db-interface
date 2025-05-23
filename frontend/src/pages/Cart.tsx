import {
	Button,
	Card,
	Form,
	Input,
	Modal,
	Space,
	Table,
	Typography,
	message,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useCreateOrder } from '../hooks/useOrders'
import { authService } from '../services/auth'
import { cartService, type CartItem } from '../services/cart'
import type { OrderCreateDto } from '../types/order'

const { Title, Text } = Typography

const Cart: React.FC = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const [form] = Form.useForm()
	const createMutation = useCreateOrder()
	const [messageApi, contextHolder] = message.useMessage()

	useEffect(() => {
		setCartItems(cartService.getCart())
	}, [])

	const handleQuantityChange = (
		itemId: number,
		pharmacyId: number,
		quantity: number
	) => {
		cartService.updateQuantity(itemId, pharmacyId, quantity)
		setCartItems(cartService.getCart())
	}

	const handleRemoveItem = (itemId: number, pharmacyId: number) => {
		cartService.removeFromCart(itemId, pharmacyId)
		setCartItems(cartService.getCart())
	}

	const handleCreateOrder = async (values: { orderAddress: string }) => {
		if (cartItems.length === 0) {
			messageApi.error('Корзина пуста')
			return
		}

		const user = authService.getAuthData()
		if (!user) {
			messageApi.error('Пользователь не авторизован')
			return
		}

		const orderRequest: OrderCreateDto = {
			clientId: user.userId,
			pharmacyId: cartItems[0].pharmacyId,
			orderAddress: values.orderAddress,
			medications: cartItems.map(item => ({
				medicationId: item.id,
				quantity: item.quantity,
				price: item.price,
			})),
			assemblerIds: [1, 2], // Временные ID, бэкенд заменит на реальных
			courierIds: [1], // Временный ID, бэкенд заменит на реального
			discountCardId: user.discountCardId,
		}

		try {
			await createMutation.mutateAsync(orderRequest)
			cartService.clearCart()
			setCartItems([])
			setIsCreateModalVisible(false)
			messageApi.success('Заказ успешно создан')
		} catch (error) {
			messageApi.error('Ошибка при создании заказа')
		}
	}

	const columns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Форма',
			dataIndex: 'form',
			key: 'form',
		},
		{
			title: 'Действующее вещество',
			dataIndex: 'activeSubstance',
			key: 'activeSubstance',
		},
		{
			title: 'Цена',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
		},
		{
			title: 'Количество',
			key: 'quantity',
			render: (_: unknown, record: CartItem) => (
				<Space>
					<Button
						onClick={() =>
							handleQuantityChange(
								record.id,
								record.pharmacyId,
								record.quantity - 1
							)
						}
						disabled={record.quantity <= 1}
					>
						-
					</Button>
					<Text>{record.quantity}</Text>
					<Button
						onClick={() =>
							handleQuantityChange(
								record.id,
								record.pharmacyId,
								record.quantity + 1
							)
						}
						disabled={record.quantity >= record.quantity}
					>
						+
					</Button>
				</Space>
			),
		},
		{
			title: 'Сумма',
			key: 'total',
			render: (record: CartItem) =>
				`${(record.price * record.quantity).toLocaleString('ru-RU')} ₽`,
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: unknown, record: CartItem) => (
				<Button
					type='primary'
					danger
					onClick={() => handleRemoveItem(record.id, record.pharmacyId)}
				>
					Удалить
				</Button>
			),
		},
	]

	const total = cartService.getTotal()

	return (
		<Card>
			{contextHolder}
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Title level={2}>Корзина</Title>
					<Button
						type='primary'
						onClick={() => setIsCreateModalVisible(true)}
						disabled={cartItems.length === 0}
					>
						Оформить заказ
					</Button>
				</div>

				<Table
					columns={columns}
					dataSource={cartItems}
					rowKey={record => `${record.id}-${record.pharmacyId}`}
					pagination={false}
					summary={() => (
						<Table.Summary.Row>
							<Table.Summary.Cell index={0} colSpan={5}>
								<Text strong>Итого:</Text>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1}>
								<Text strong>{total.toLocaleString('ru-RU')} ₽</Text>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={2} />
						</Table.Summary.Row>
					)}
				/>
			</Space>

			<Modal
				title='Оформление заказа'
				open={isCreateModalVisible}
				onCancel={() => setIsCreateModalVisible(false)}
				footer={null}
			>
				<Form form={form} onFinish={handleCreateOrder} layout='vertical'>
					<Form.Item
						name='orderAddress'
						label='Адрес доставки'
						rules={[
							{ required: true, message: 'Пожалуйста, введите адрес доставки' },
						]}
					>
						<Input.TextArea rows={2} />
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={createMutation.isPending}
							block
						>
							Подтвердить заказ
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	)
}

export default Cart
