import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Table } from 'antd'
import React, { useState } from 'react'
import EmployeeForm from '../components/employees/EmployeeForm'
import { useDebounce } from '../hooks/useDebounce'
import {
	useCreateEmployee,
	useDeleteEmployee,
	useEmployees,
	useUpdateEmployee,
} from '../hooks/useEmployees'
import { Employee } from '../types/employee'

const { Search } = Input

const Employees: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)

	const debouncedSearch = useDebounce(searchTerm, 300)

	const { data: employees, isLoading } = useEmployees(debouncedSearch)
	const createMutation = useCreateEmployee()
	const updateMutation = useUpdateEmployee()
	const deleteMutation = useDeleteEmployee()

	const columns = [
		{
			title: 'ФИО',
			dataIndex: 'fullName',
			key: 'fullName',
			sorter: (a: Employee, b: Employee) =>
				a.fullName.localeCompare(b.fullName),
		},
		{
			title: 'Должность',
			dataIndex: 'positionDescription',
			key: 'positionDescription',
		},
		{
			title: 'Аптека',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
		},
		{
			title: 'Зарплата',
			dataIndex: 'finalSalary',
			key: 'finalSalary',
			render: (salary: number) => `${salary.toLocaleString('ru-RU')} ₽`,
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: Employee) => (
				<Space>
					<Button
						icon={<EditOutlined />}
						onClick={() => {
							setSelectedEmployee(record)
							setIsModalVisible(true)
						}}
					/>
				</Space>
			),
		},
	]

	const handleSubmit = async (values: any) => {
		if (selectedEmployee) {
			await updateMutation.mutateAsync({
				id: selectedEmployee.id,
				data: values,
			})
		} else {
			await createMutation.mutateAsync(values)
		}
		setIsModalVisible(false)
		setSelectedEmployee(null)
	}

	return (
		<div className='p-6'>
			<div className='flex justify-between mb-6'>
				<Search
					placeholder='Поиск сотрудников...'
					onChange={e => setSearchTerm(e.target.value)}
					style={{ width: 300 }}
				/>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setSelectedEmployee(null)
						setIsModalVisible(true)
					}}
				>
					Добавить сотрудника
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={employees}
				loading={isLoading}
				rowKey='id'
			/>

			<Modal
				title={
					selectedEmployee
						? 'Редактировать сотрудника'
						: 'Добавить нового сотрудника'
				}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false)
					setSelectedEmployee(null)
				}}
				footer={null}
			>
				<EmployeeForm
					initialValues={selectedEmployee || undefined}
					onSubmit={handleSubmit}
					loading={createMutation.isPending || updateMutation.isPending}
				/>
			</Modal>
		</div>
	)
}

export default Employees
