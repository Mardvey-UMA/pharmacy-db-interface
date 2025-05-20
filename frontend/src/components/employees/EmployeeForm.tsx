import { Button, Form, Input, Select } from 'antd'
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

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={initialValues}
			onFinish={onSubmit}
		>
			<Form.Item
				name='fullName'
				label='Full Name'
				rules={[
					{ required: true, message: 'Please enter full name' },
					{ min: 2, message: 'Name must be at least 2 characters' },
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name='passport'
				label='Passport'
				rules={[
					{ required: true, message: 'Please enter passport number' },
					{ pattern: /^[A-Z0-9]+$/, message: 'Invalid passport format' },
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name='positionId'
				label='Position'
				rules={[{ required: true, message: 'Please select position' }]}
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
					label='Pharmacy'
					rules={[{ required: true, message: 'Please select pharmacy' }]}
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
					{initialValues ? 'Update' : 'Create'} Employee
				</Button>
			</Form.Item>
		</Form>
	)
}

export default EmployeeForm
