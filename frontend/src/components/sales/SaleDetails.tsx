import { Descriptions, Empty, Spin, Table } from 'antd'
import { format } from 'date-fns'
import React from 'react'
import { useSaleDetails } from '../../hooks/useSales'
import type { MedicationShort } from '../../types/sale'

interface SaleDetailsProps {
	saleId: number
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ saleId }) => {
	const { data: sale, isLoading, error } = useSaleDetails(saleId)

	if (isLoading) {
		return <Spin size='large' className='flex justify-center p-8' />
	}

	if (error || !sale) {
		return <Empty description='Не удалось загрузить детали продажи' />
	}

	const columns = [
		{
			title: 'Лекарство',
			dataIndex: 'name',
			key: 'name',
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
			render: (_, record: MedicationShort) =>
				`${(record.price * record.quantity).toFixed(2)} ₽`,
		},
	]

	return (
		<div className='space-y-6'>
			<Descriptions title='Информация о продаже' bordered>
				<Descriptions.Item label='Дата'>
					{format(new Date(sale.saleDate), 'dd.MM.yyyy')}
				</Descriptions.Item>
				<Descriptions.Item label='Время'>
					{sale.saleTime.split(':').slice(0, 2).join(':')}
				</Descriptions.Item>
				<Descriptions.Item label='Сотрудник'>
					{sale.employeeName}
				</Descriptions.Item>
				<Descriptions.Item label='Клиент'>{sale.clientName}</Descriptions.Item>
				<Descriptions.Item label='Итого'>
					{sale.total.toFixed(2)} ₽
				</Descriptions.Item>
			</Descriptions>

			<Table
				title={() => <h3 className='text-lg font-semibold'>Товары</h3>}
				columns={columns}
				dataSource={sale.items}
				rowKey='name'
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

export default SaleDetails
