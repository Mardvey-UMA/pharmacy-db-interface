import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Select, Space } from 'antd'
import React, { useState } from 'react'
import { useEmployees } from '../../hooks/useEmployees'
import { useMedications } from '../../hooks/useMedications'
import { usePharmacies } from '../../hooks/usePharmacies'
import type { SaleRequest } from '../../types/sale'

interface SaleFormProps {
	onSubmit: (values: SaleRequest) => void
	loading: boolean
}

const SaleForm: React.FC<SaleFormProps> = ({ onSubmit, loading }) => {
	const [form] = Form.useForm()
	const { data: employees } = useEmployees()
	const { data: pharmacies } = usePharmacies()
	const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(
		null
	)
	const { data: medications } = useMedications(selectedPharmacyId)

	const handleSubmit = (values: any) => {
		const saleRequest: SaleRequest = {
			pharmacyId: values.pharmacyId,
			employeeId: values.employeeId,
			medications: values.medications.map((med: any) => ({
				medicationId: med.medicationId,
				quantity: med.quantity,
			})),
			discountCardId: values.discountCardId,
			prescriptionNumber: values.prescriptionNumber,
		}
		onSubmit(saleRequest)
	}

	const handlePharmacyChange = (value: number) => {
		setSelectedPharmacyId(value)
		form.setFieldsValue({ medications: [] })
	}

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={handleSubmit}
			initialValues={{ medications: [{}] }}
		>
			<Form.Item
				name='pharmacyId'
				label='Pharmacy'
				rules={[{ required: true, message: 'Please select pharmacy' }]}
			>
				<Select onChange={handlePharmacyChange}>
					{pharmacies?.map(pharmacy => (
						<Select.Option key={pharmacy.id} value={pharmacy.id}>
							{pharmacy.pharmacyAddress}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				name='employeeId'
				label='Employee'
				rules={[{ required: true, message: 'Please select employee' }]}
			>
				<Select>
					{employees?.map(employee => (
						<Select.Option key={employee.id} value={employee.id}>
							{employee.fullName}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.List name='medications'>
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
									rules={[{ required: true, message: 'Missing medication' }]}
								>
									<Select
										placeholder='Select medication'
										style={{ width: 300 }}
										disabled={!selectedPharmacyId}
									>
										{medications?.map(medication => (
											<Select.Option
												key={medication.id}
												value={medication.id}
												disabled={medication.quantity <= 0}
											>
												{medication.name} - {medication.form} ($
												{medication.price.toFixed(2)}, Available:{' '}
												{medication.quantity})
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item
									{...restField}
									name={[name, 'quantity']}
									rules={[
										{ required: true, message: 'Missing quantity' },
										({ getFieldValue }) => ({
											validator(_, value) {
												const medicationId = getFieldValue([
													'medications',
													name,
													'medicationId',
												])
												const medication = medications?.find(
													m => m.id === medicationId
												)
												if (!medication || value <= medication.quantity) {
													return Promise.resolve()
												}
												return Promise.reject(
													new Error(
														`Maximum available quantity is ${medication.quantity}`
													)
												)
											},
										}),
									]}
								>
									<InputNumber
										min={1}
										placeholder='Quantity'
										disabled={!selectedPharmacyId}
									/>
								</Form.Item>
								<MinusCircleOutlined onClick={() => remove(name)} />
							</Space>
						))}
						<Form.Item>
							<Button
								type='dashed'
								onClick={() => add()}
								block
								icon={<PlusOutlined />}
								disabled={!selectedPharmacyId}
							>
								Add Medication
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>

			<Form.Item name='discountCardId' label='Discount Card ID'>
				<InputNumber style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item name='prescriptionNumber' label='Prescription Number'>
				<Input />
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' loading={loading}>
					Create Sale
				</Button>
			</Form.Item>
		</Form>
	)
}

export default SaleForm
