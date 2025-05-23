import { MinusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Select,
	Space,
	Table,
	Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useEmployees } from '../../hooks/useEmployees'
import { useMedications } from '../../hooks/useMedications'
import { usePharmacies } from '../../hooks/usePharmacies'
import { authService } from '../../services/auth'
import type { MedicationInPharmacy } from '../../types/medication'
import type { SaleRequest } from '../../types/sale'

const { Text } = Typography

interface SaleFormProps {
	onSubmit: (values: SaleRequest) => void
	loading: boolean
	isUserMode?: boolean
}

const SaleForm: React.FC<SaleFormProps> = ({
	onSubmit,
	loading,
	isUserMode = false,
}) => {
	const [form] = Form.useForm()
	const { data: employees } = useEmployees()
	const { data: pharmacies } = usePharmacies()
	const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(
		null
	)
	const { data: medications } = useMedications(selectedPharmacyId)
	const [searchText, setSearchText] = useState('')
	const [messageApi, contextHolder] = message.useMessage()
	const [tableKey, setTableKey] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const user = authService.getAuthData()

	useEffect(() => {
		form.resetFields()
		setSelectedPharmacyId(null)
		setSearchText('')
	}, [])

	const handleSubmit = (values: any) => {
		if (!values.medications || values.medications.length === 0) {
			setIsModalVisible(true)
			return
		}

		const saleRequest: SaleRequest = {
			pharmacyId: values.pharmacyId,
			employeeId: isUserMode ? 1 : values.employeeId,
			medications: values.medications.map(item => ({
				medicationId: item.medicationId,
				quantity: item.quantity,
				price: item.price,
			})),
			discountCardId: user.discountCardId,
			prescriptionNumber: values.prescriptionNumber,
		}
		onSubmit(saleRequest)
		form.resetFields()
		setSelectedPharmacyId(null)
		setSearchText('')
	}

	const handlePharmacyChange = (value: number) => {
		setSelectedPharmacyId(value)
		form.setFieldsValue({ medications: [] })
		setSearchText('')
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handleSearch = (value: string) => {
		setSearchText(value)
		setTableKey(prev => prev + 1)
		setCurrentPage(1)
	}

	const handleMedicationSelect = (medication: MedicationInPharmacy) => {
		const currentMedications = form.getFieldValue('medications') || []

		const isAlreadyAdded = currentMedications.some(
			(med: any) => med.medicationId === medication.id
		)

		if (!isAlreadyAdded) {
			const newMedications = [
				...currentMedications,
				{
					medicationId: medication.id,
					quantity: 1,
				},
			]
			form.setFieldsValue({
				medications: newMedications,
			})
			setTableKey(prev => prev + 1)
		}
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		setTableKey(prev => prev + 1)
	}

	const filteredMedications =
		medications?.filter(med => {
			if (!searchText) return true
			return (
				med.name.toLowerCase().includes(searchText.toLowerCase()) ||
				med.activeSubstance.toLowerCase().includes(searchText.toLowerCase())
			)
		}) || []

	const medicationColumns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
		},
		{
			title: 'Форма',
			dataIndex: 'form',
			key: 'form',
			width: '15%',
		},
		{
			title: 'Действующее вещество',
			dataIndex: 'activeSubstance',
			key: 'activeSubstance',
			width: '20%',
		},
		{
			title: 'Цена',
			dataIndex: 'price',
			key: 'price',
			width: '15%',
			render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
		},
		{
			title: 'В наличии',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '15%',
		},
		{
			title: 'Действия',
			key: 'actions',
			width: '15%',
			render: (_, record: MedicationInPharmacy) => {
				const currentMedications = form.getFieldValue('medications') || []
				const isAlreadyAdded = currentMedications.some(
					(med: any) => med.medicationId === record.id
				)

				return (
					<Button
						type='primary'
						size='small'
						onClick={() => handleMedicationSelect(record)}
						disabled={record.quantity <= 0 || isAlreadyAdded}
					>
						{isAlreadyAdded ? 'Добавлено' : 'Выбрать'}
					</Button>
				)
			},
		},
	]

	return (
		<>
			{contextHolder}
			<Form
				form={form}
				layout='vertical'
				onFinish={handleSubmit}
				initialValues={{ medications: [] }}
			>
				<Form.Item
					name='pharmacyId'
					label='Аптека'
					rules={[{ required: true, message: 'Пожалуйста, выберите аптеку' }]}
				>
					<Select onChange={handlePharmacyChange}>
						{pharmacies?.map(pharmacy => (
							<Select.Option key={pharmacy.id} value={pharmacy.id}>
								{pharmacy.pharmacyAddress}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{!isUserMode && (
					<Form.Item
						name='employeeId'
						label='Сотрудник'
						rules={[
							{ required: true, message: 'Пожалуйста, выберите сотрудника' },
						]}
					>
						<Select>
							{employees?.map(employee => (
								<Select.Option key={employee.id} value={employee.id}>
									{employee.fullName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				)}

				{selectedPharmacyId && medications && (
					<div style={{ marginBottom: 24 }}>
						<div style={{ marginBottom: 16 }}>
							<Input
								placeholder='Поиск по названию или действующему веществу'
								value={searchText}
								onChange={e => handleSearch(e.target.value)}
								prefix={<SearchOutlined />}
								allowClear
							/>
						</div>
						<Table
							key={tableKey}
							dataSource={filteredMedications}
							columns={medicationColumns}
							rowKey='id'
							size='small'
							pagination={{
								pageSize: 5,
								current: currentPage,
								onChange: handlePageChange,
							}}
							scroll={{ y: 200 }}
						/>
					</div>
				)}

				<Form.List
					name='medications'
					rules={[
						{
							validator: async (_, medications) => {
								if (!medications || medications.length === 0) {
									return Promise.reject(
										new Error('Пожалуйста, выберите хотя бы одно лекарство')
									)
								}
							},
						},
					]}
				>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Space
									key={key}
									style={{ display: 'flex', marginBottom: 8 }}
									align='baseline'
								>
									<Form.Item
										{...restField}
										name={[name, 'medicationId']}
										rules={[
											{
												required: true,
												message: 'Пожалуйста, выберите лекарство',
											},
										]}
									>
										<Text>
											{medications?.find(
												med =>
													med.id ===
													form.getFieldValue([
														'medications',
														name,
														'medicationId',
													])
											)?.name || 'Неизвестное лекарство'}
										</Text>
									</Form.Item>

									<Form.Item
										{...restField}
										name={[name, 'quantity']}
										rules={[
											{
												required: true,
												message: 'Пожалуйста, введите количество',
											},
										]}
									>
										<InputNumber min={1} placeholder='Количество' />
									</Form.Item>

									<MinusCircleOutlined onClick={() => remove(name)} />
								</Space>
							))}
						</>
					)}
				</Form.List>

				<Form.Item name='prescriptionNumber' label='Номер рецепта'>
					<Input />
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit' loading={loading}>
						Создать покупку
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

export default SaleForm
