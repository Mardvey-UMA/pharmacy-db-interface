import { Card, Space, Table, Typography } from 'antd'
import React, { useState } from 'react'
import { usePharmacies } from '../hooks/usePharmacies'
import type { Pharmacy } from '../types/pharmacy'

const { Title } = Typography

const UserPharmacies: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const { data: pharmacies, isLoading } = usePharmacies()

	const columns = [
		{
			title: 'Адрес',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
			sorter: (a: Pharmacy, b: Pharmacy) =>
				a.pharmacyAddress.localeCompare(b.pharmacyAddress),
		},
	]

	return (
		<Card>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<Title level={2}>Аптеки</Title>
				<Table
					columns={columns}
					dataSource={pharmacies}
					rowKey='id'
					loading={isLoading}
					pagination={{
						current: currentPage,
						pageSize: 10,
						showSizeChanger: true,
						showTotal: total => `Всего ${total} аптек`,
						onChange: page => setCurrentPage(page),
					}}
				/>
			</Space>
		</Card>
	)
}

export default UserPharmacies
