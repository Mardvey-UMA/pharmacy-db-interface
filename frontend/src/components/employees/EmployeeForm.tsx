import { Button, Form, Input, Select, Space } from 'antd'
import React from 'react'
import { usePharmacies } from '../../hooks/usePharmacies'
import { usePositions } from '../../hooks/usePositions'
import {
	Employee,
	EmployeeCreateDto,
	EmployeeUpdateDto,
} from '../../types/employee'

interface EmployeeFormProps {
	initialValues?: Employee
	onSubmit: (values: EmployeeCreateDto | EmployeeUpdateDto) => void
	loading: boolean
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
	initialValues,
	onSubmit,
	loading,
}) => {
	const [form] = Form.useForm()
	const { data: positions } = usePositions()
	const { data: pharmacies } = usePharmacies()

	const handleSubmit = (values: any) => {
		// Объединяем серию и номер паспорта
		const passport = `${values.passportSeries} ${values.passportNumber}`
		const submitValues = {
			...values,
			passport,
		}
		delete submitValues.passportSeries
		delete submitValues.passportNumber
		onSubmit(submitValues)
	}

	// Разделяем паспорт на серию и номер при инициализации формы
	React.useEffect(() => {
		if (initialValues?.passport) {
			const [series, number] = initialValues.passport.split(' ')
			form.setFieldsValue({
				passportSeries: series,
				passportNumber: number,
			})
		}
	}, [initialValues, form])

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={initialValues}
			onFinish={handleSubmit}
		>
			<Form.Item
				name='fullName'
				label='ФИО'
				rules={[
					{ required: true, message: 'Пожалуйста, введите ФИО' },
					{ min: 2, message: 'Имя должно содержать минимум 2 символа' },
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item label='Паспорт' required>
				<Space>
					<Form.Item
						name='passportSeries'
						rules={[
							{ required: true, message: 'Введите серию' },
							{
								pattern: /^\d{4}$/,
								message: 'Серия должна состоять из 4 цифр',
							},
						]}
						noStyle
					>
						<Input maxLength={4} placeholder='Серия' style={{ width: 100 }} />
					</Form.Item>
					<Form.Item
						name='passportNumber'
						rules={[
							{ required: true, message: 'Введите номер' },
							{
								pattern: /^\d{6}$/,
								message: 'Номер должен состоять из 6 цифр',
							},
						]}
						noStyle
					>
						<Input maxLength={6} placeholder='Номер' style={{ width: 150 }} />
					</Form.Item>
				</Space>
			</Form.Item>

			<Form.Item
				name='positionId'
				label='Должность'
				rules={[{ required: true, message: 'Пожалуйста, выберите должность' }]}
			>
				<Select>
					{positions?.map(position => (
						<Select.Option key={position.id} value={position.id}>
							{position.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			{!initialValues && (
				<Form.Item
					name='pharmacyId'
					label='Аптека'
					rules={[{ required: true, message: 'Пожалуйста, выберите аптеку' }]}
				>
					<Select>
						{pharmacies?.map(pharmacy => (
							<Select.Option key={pharmacy.id} value={pharmacy.id}>
								{pharmacy.pharmacyAddress}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			)}

			<Form.Item>
				<Button type='primary' htmlType='submit' loading={loading}>
					{initialValues ? 'Обновить' : 'Создать'} сотрудника
				</Button>
			</Form.Item>
		</Form>
	)
}

export default EmployeeForm
