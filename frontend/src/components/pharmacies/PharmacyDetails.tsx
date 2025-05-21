import { Descriptions, Empty, Spin, Table, Tabs, Tag } from 'antd'
import { format } from 'date-fns'
import React from 'react'
import { usePharmacyDetails } from '../../hooks/usePharmacies'

interface PharmacyDetailsProps {
	pharmacyId: number
}

const PharmacyDetails: React.FC<PharmacyDetailsProps> = ({ pharmacyId }) => {
	const { data: pharmacy, isLoading, error } = usePharmacyDetails(pharmacyId)

	if (isLoading) {
		return <Spin size='large' className='flex justify-center p-8' />
	}

	if (error || !pharmacy) {
		return <Empty description='Не удалось загрузить информацию об аптеке' />
	}

	const employeeColumns = [
		{
			title: 'ФИО',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Должность',
			dataIndex: 'positionDescription',
			key: 'positionDescription',
		},
		{
			title: 'Зарплата',
			dataIndex: 'finalSalary',
			key: 'finalSalary',
			render: (salary: number) => `${salary.toLocaleString('ru-RU')} ₽`,
		},
	]

	const medicationColumns = [
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
			title: 'Количество',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Цена',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
		},
		{
			title: 'Срок годности',
			dataIndex: 'expirationDate',
			key: 'expirationDate',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
		},
	]

	const supplyColumns = [
		{
			title: 'Дата',
			dataIndex: 'supplyDate',
			key: 'supplyDate',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
		},
		{
			title: 'Поставщик',
			dataIndex: 'vendorName',
			key: 'vendorName',
		},
		{
			title: 'Статус',
			dataIndex: 'accepted',
			key: 'accepted',
			render: (accepted: boolean) => (
				<Tag color={accepted ? 'success' : 'warning'}>
					{accepted ? 'Принято' : 'В ожидании'}
				</Tag>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<Descriptions title='Информация об аптеке' bordered>
				<Descriptions.Item label='Адрес'>
					{pharmacy.pharmacyAddress}
				</Descriptions.Item>
			</Descriptions>

			<Tabs
				defaultActiveKey='employees'
				items={[
					{
						key: 'employees',
						label: 'Сотрудники',
						children: (
							<Table
								columns={employeeColumns}
								dataSource={pharmacy.employees}
								rowKey='id'
								pagination={{ pageSize: 5 }}
							/>
						),
					},
					{
						key: 'medications',
						label: 'Лекарства',
						children: (
							<Table
								columns={medicationColumns}
								dataSource={pharmacy.medications}
								rowKey='id'
								pagination={{ pageSize: 5 }}
							/>
						),
					},
					{
						key: 'supplies',
						label: 'Поставки',
						children: (
							<Table
								columns={supplyColumns}
								dataSource={pharmacy.supplies}
								rowKey='id'
								pagination={{ pageSize: 5 }}
							/>
						),
					},
				]}
			/>
		</div>
	)
}

export default PharmacyDetails
