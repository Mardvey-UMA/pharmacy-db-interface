import { Button, DatePicker, Modal, Select, Space, Table } from 'antd'
import { format } from 'date-fns'
import React, { useState } from 'react'
import SaleDetails from '../components/sales/SaleDetails'
import SaleForm from '../components/sales/SaleForm'
import { usePharmacies } from '../hooks/usePharmacies'
import { useCreateSale, useSales } from '../hooks/useSales'
import type { Sale, SaleFilterDto, SaleRequest } from '../types/sale'

const { RangePicker } = DatePicker

const Sales: React.FC = () => {
	const [filter, setFilter] = useState<SaleFilterDto>({})
	const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

	const { data: sales, isLoading } = useSales(filter)
	const { data: pharmacies } = usePharmacies()
	const createMutation = useCreateSale()

	const columns = [
		{
			title: 'Дата',
			dataIndex: 'saleDate',
			key: 'saleDate',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
			sorter: (a: Sale, b: Sale) =>
				new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime(),
		},
		{
			title: 'Сотрудник',
			dataIndex: 'employeeName',
			key: 'employeeName',
			sorter: (a: Sale, b: Sale) =>
				a.employeeName.localeCompare(b.employeeName),
		},
		{
			title: 'Клиент',
			dataIndex: 'clientName',
			key: 'clientName',
		},
		{
			title: 'Сумма',
			dataIndex: 'total',
			key: 'total',
			render: (total: number) => `${total.toLocaleString('ru-RU')} ₽`,
			sorter: (a: Sale, b: Sale) => a.total - b.total,
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: Sale) => (
				<a onClick={() => setSelectedSaleId(record.id)}>Просмотр</a>
			),
		},
	]

	const handleDateRangeChange = (dates: any) => {
		if (dates) {
			setFilter({
				...filter,
				from: dates[0].format('YYYY-MM-DD'),
				to: dates[1].format('YYYY-MM-DD'),
			})
		} else {
			const { from, to, ...rest } = filter
			setFilter(rest)
		}
	}

	const handlePharmacyChange = (value: number | null) => {
		if (value) {
			setFilter({ ...filter, pharmacyId: value })
		} else {
			const { pharmacyId, ...rest } = filter
			setFilter(rest)
		}
	}

	const handleCreateSale = async (values: SaleRequest) => {
		await createMutation.mutateAsync(values)
		setIsCreateModalVisible(false)
	}

	return (
		<div className='p-6'>
			<div className='flex justify-between mb-6'>
				<Space size='middle'>
					<RangePicker onChange={handleDateRangeChange} />
					<Select
						allowClear
						placeholder='Выберите аптеку'
						style={{ width: 200 }}
						onChange={handlePharmacyChange}
					>
						{pharmacies?.map(pharmacy => (
							<Select.Option key={pharmacy.id} value={pharmacy.id}>
								{pharmacy.pharmacyAddress}
							</Select.Option>
						))}
					</Select>
				</Space>
				<Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
					Новая продажа
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={sales}
				loading={isLoading}
				rowKey='id'
			/>

			<Modal
				title='Детали продажи'
				open={!!selectedSaleId}
				onCancel={() => setSelectedSaleId(null)}
				width={800}
				footer={null}
			>
				{selectedSaleId && <SaleDetails saleId={selectedSaleId} />}
			</Modal>

			<Modal
				title='Создать новую продажу'
				open={isCreateModalVisible}
				onCancel={() => setIsCreateModalVisible(false)}
				width={800}
				footer={null}
			>
				<SaleForm
					onSubmit={handleCreateSale}
					loading={createMutation.isPending}
				/>
			</Modal>
		</div>
	)
}

export default Sales
