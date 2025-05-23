import { Button, Input, message, Select, Space, Table } from 'antd'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useMedications } from '../hooks/useMedications'
import { usePharmacies } from '../hooks/usePharmacies'
import { cartService } from '../services/cart'
import { medicationService } from '../services/medicationService'
import type { MedicationInPharmacy } from '../types/medication'

const { Search } = Input

const Catalog: React.FC = () => {
	const [messageApi, contextHolder] = message.useMessage()
	const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(
		null
	)
	const [searchText, setSearchText] = useState('')
	const [selectedForm, setSelectedForm] = useState<string | null>(null)
	const [selectedSubstance, setSelectedSubstance] = useState<string | null>(
		null
	)
	const [allMedications, setAllMedications] = useState<MedicationInPharmacy[]>(
		[]
	)
	const [isLoadingAll, setIsLoadingAll] = useState(false)
	const [tableKey, setTableKey] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	const { data: pharmacies } = usePharmacies()
	const { data: pharmacyMedications, isLoading: isLoadingPharmacy } =
		useMedications(selectedPharmacyId)

	useEffect(() => {
		const fetchAllMedications = async () => {
			if (!pharmacies) return
			setIsLoadingAll(true)

			try {
				const medicationsPromises = pharmacies.map(pharmacy =>
					medicationService.getByPharmacy(pharmacy.id)
				)
				const results = await Promise.all(medicationsPromises)
				const allMeds = results.flat()
				setAllMedications(allMeds)
			} catch (error) {
				console.error('Ошибка при загрузке лекарств:', error)
				messageApi.error('Ошибка при загрузке лекарств')
			} finally {
				setIsLoadingAll(false)
			}
		}

		fetchAllMedications()
	}, [pharmacies])

	const handlePharmacyChange = (value: number | null) => {
		setSelectedPharmacyId(value)
		setSearchText('')
		setSelectedForm(null)
		setSelectedSubstance(null)
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handleSearch = (value: string) => {
		setSearchText(value)
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handleFormChange = (value: string | null) => {
		setSelectedForm(value)
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handleSubstanceChange = (value: string | null) => {
		setSelectedSubstance(value)
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		setTableKey(prev => prev + 1)
	}

	const handleAddToCart = (medication: MedicationInPharmacy) => {
		cartService.addToCart(medication)
		messageApi.success('Товар добавлен в корзину')
	}

	const uniqueForms = useMemo(
		() => Array.from(new Set(allMedications.map(med => med.form))),
		[allMedications]
	)

	const uniqueSubstances = useMemo(
		() => Array.from(new Set(allMedications.map(med => med.activeSubstance))),
		[allMedications]
	)

	const filteredMedications = useMemo(() => {
		const sourceData = selectedPharmacyId ? pharmacyMedications : allMedications
		if (!sourceData) return []

		return sourceData.filter(med => {
			const matchesSearch =
				!searchText ||
				med.name.toLowerCase().includes(searchText.toLowerCase()) ||
				med.activeSubstance.toLowerCase().includes(searchText.toLowerCase())

			const matchesForm = !selectedForm || med.form === selectedForm
			const matchesSubstance =
				!selectedSubstance || med.activeSubstance === selectedSubstance

			return matchesSearch && matchesForm && matchesSubstance
		})
	}, [
		selectedPharmacyId,
		pharmacyMedications,
		allMedications,
		searchText,
		selectedForm,
		selectedSubstance,
	])

	const columns = useMemo(
		() => [
			{
				title: 'Название',
				dataIndex: 'name',
				key: 'name',
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					a.name.localeCompare(b.name),
			},
			{
				title: 'Форма',
				dataIndex: 'form',
				key: 'form',
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					a.form.localeCompare(b.form),
			},
			{
				title: 'Действующее вещество',
				dataIndex: 'activeSubstance',
				key: 'activeSubstance',
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					a.activeSubstance.localeCompare(b.activeSubstance),
			},
			{
				title: 'Срок годности',
				dataIndex: 'expirationDate',
				key: 'expirationDate',
				render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					new Date(a.expirationDate).getTime() -
					new Date(b.expirationDate).getTime(),
			},
			{
				title: 'Адрес аптеки',
				dataIndex: 'pharmacyId',
				key: 'pharmacyAddress',
				render: (pharmacyId: number) => {
					const pharmacy = pharmacies?.find(p => p.id === pharmacyId)
					return pharmacy?.pharmacyAddress || 'Неизвестно'
				},
			},
			{
				title: 'Цена',
				dataIndex: 'price',
				key: 'price',
				render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					a.price - b.price,
			},
			{
				title: 'В наличии',
				dataIndex: 'quantity',
				key: 'quantity',
				sorter: (a: MedicationInPharmacy, b: MedicationInPharmacy) =>
					a.quantity - b.quantity,
			},
			{
				title: 'Действия',
				key: 'actions',
				render: (_: unknown, record: MedicationInPharmacy) => (
					<Button
						type='primary'
						onClick={() => handleAddToCart(record)}
						disabled={record.quantity <= 0}
					>
						В корзину
					</Button>
				),
			},
		],
		[pharmacies]
	)

	return (
		<div className='p-6'>
			{contextHolder}
			<div className='flex flex-col gap-4 mb-6'>
				<div className='flex justify-between'>
					<Space size='middle' style={{ width: '100%' }}>
						<Select
							allowClear
							placeholder='Выберите аптеку'
							style={{ width: 200 }}
							onChange={handlePharmacyChange}
							value={selectedPharmacyId}
						>
							{pharmacies?.map(pharmacy => (
								<Select.Option key={pharmacy.id} value={pharmacy.id}>
									{pharmacy.pharmacyAddress}
								</Select.Option>
							))}
						</Select>
						<Search
							placeholder='Поиск по названию или действующему веществу'
							allowClear
							onSearch={handleSearch}
							onChange={e => handleSearch(e.target.value)}
							style={{ width: 300 }}
							value={searchText}
						/>
					</Space>
				</div>
				<div className='flex gap-4'>
					<Select
						allowClear
						placeholder='Форма выпуска'
						style={{ width: 200 }}
						onChange={handleFormChange}
						value={selectedForm}
					>
						{uniqueForms.map(form => (
							<Select.Option key={form} value={form}>
								{form}
							</Select.Option>
						))}
					</Select>
					<Select
						allowClear
						placeholder='Действующее вещество'
						style={{ width: 200 }}
						onChange={handleSubstanceChange}
						value={selectedSubstance}
					>
						{uniqueSubstances.map(substance => (
							<Select.Option key={substance} value={substance}>
								{substance}
							</Select.Option>
						))}
					</Select>
				</div>
			</div>

			<Table
				key={tableKey}
				columns={columns}
				dataSource={filteredMedications}
				rowKey={record => `${record.id}-${record.pharmacyId}`}
				loading={selectedPharmacyId ? isLoadingPharmacy : isLoadingAll}
				pagination={{
					pageSize: 10,
					current: currentPage,
					showSizeChanger: true,
					showTotal: total => `Всего ${total} записей`,
					onChange: handlePageChange,
				}}
			/>
		</div>
	)
}

export default Catalog
