import { Input, Modal, Table } from 'antd'
import React, { useState } from 'react'
import PharmacyDetails from '../components/pharmacies/PharmacyDetails'
import { usePharmacies } from '../hooks/usePharmacies'
import type { Pharmacy } from '../types/pharmacy'

const { Search } = Input

const Pharmacies: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(
		null
	)

	const { data: pharmacies, isLoading } = usePharmacies(searchTerm)

	const columns = [
		{
			title: 'Адрес',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
			sorter: (a: Pharmacy, b: Pharmacy) =>
				a.pharmacyAddress.localeCompare(b.pharmacyAddress),
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: Pharmacy) => (
				<a onClick={() => setSelectedPharmacyId(record.id)}>Просмотр</a>
			),
		},
	]

	return (
		<div className='p-6'>
			<div className='mb-6'>
				<Search
					placeholder='Поиск аптек...'
					onChange={e => setSearchTerm(e.target.value)}
					style={{ width: 300 }}
				/>
			</div>

			<Table
				columns={columns}
				dataSource={pharmacies}
				loading={isLoading}
				rowKey='id'
			/>

			<Modal
				title='Детали аптеки'
				open={!!selectedPharmacyId}
				onCancel={() => setSelectedPharmacyId(null)}
				width={1000}
				footer={null}
			>
				{selectedPharmacyId && (
					<PharmacyDetails pharmacyId={selectedPharmacyId} />
				)}
			</Modal>
		</div>
	)
}

export default Pharmacies
