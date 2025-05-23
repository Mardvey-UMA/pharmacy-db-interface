import { useQuery } from '@tanstack/react-query'
import { Button, Card, Modal, Space, Spin, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import SaleForm from '../components/sales/SaleForm'
import { useCreateSale } from '../hooks/useSales'
import { SaleDto, salesService } from '../services/sales'
import type { SaleRequest } from '../types/sale'

const { Title } = Typography

export default function UserSales() {
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const createMutation = useCreateSale()

	const { data: sales, isLoading } = useQuery({
		queryKey: ['userSales'],
		queryFn: salesService.getUserSales,
	})

	const columns = [
		{
			title: 'Дата покупки',
			dataIndex: 'saleDate',
			key: 'saleDate',
			render: (date: string, record: SaleDto) => {
				return `${dayjs(date).format('DD.MM.YYYY')} ${record.saleTime}`
			},
		},
		{
			title: 'Аптека',
			dataIndex: 'pharmacyName',
			key: 'pharmacyName',
		},
		{
			title: 'Продавец',
			dataIndex: 'employeeName',
			key: 'employeeName',
		},
		{
			title: 'Сумма',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => `${total.toFixed(2)} ₽`,
		},
	]

	const handleCreateSale = async (values: SaleRequest) => {
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
					<Title level={2}>Мои покупки</Title>
					<Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
						Новая покупка
					</Button>
				</div>
				<Table
					dataSource={sales}
					columns={columns}
					rowKey='id'
					pagination={{ pageSize: 10 }}
					expandable={{
						expandedRowRender: (record: SaleDto) => (
							<div style={{ padding: '20px' }}>
								<p>
									<strong>ID покупки:</strong> {record.id}
								</p>
								<p>
									<strong>Покупатель:</strong> {record.clientName}
								</p>
								<p>
									<strong>Товары:</strong>
								</p>
								<ul>
									{record.items.map(item => (
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
				title='Создать новую покупку'
				open={isCreateModalVisible}
				onCancel={() => setIsCreateModalVisible(false)}
				width={800}
				footer={null}
			>
				<SaleForm
					onSubmit={handleCreateSale}
					loading={createMutation.isPending}
					isUserMode={true}
				/>
			</Modal>
		</Card>
	)
}
