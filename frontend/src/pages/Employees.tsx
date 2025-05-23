import {
	EditOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import { Button, Input, Modal, Space, Table, Typography } from 'antd'
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
const { Title, Text } = Typography
const { confirm } = Modal

const Employees: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
	const [showChangesModal, setShowChangesModal] = useState(false)
	const [changesData, setChangesData] = useState<{
		deletedEmployeeName: string
		pharmacyAddress: string
		positionDescription: string
		changes: Array<{
			entityType: 'ORDER' | 'SALE'
			entityId: number
			role: string
			newEmployeeId: number
			newEmployeeName: string
		}>
	} | null>(null)

	const debouncedSearch = useDebounce(searchTerm, 300)

	const { data: employees, isLoading } = useEmployees(debouncedSearch)
	const createMutation = useCreateEmployee()
	const updateMutation = useUpdateEmployee()
	const deleteMutation = useDeleteEmployee()

	const handleDelete = (employee: Employee) => {
		setSelectedEmployee(employee)
		confirm({
			title: 'Увольнение сотрудника',
			icon: <ExclamationCircleOutlined />,
			content: (
				<div>
					<p>Вы уверены, что хотите уволить сотрудника {employee.fullName}?</p>
					<p>
						Это действие приведет к перераспределению его заказов и продаж
						другим сотрудникам.
					</p>
				</div>
			),
			okText: 'Да, уволить',
			okType: 'danger',
			cancelText: 'Отмена',
			onOk: async () => {
				if (selectedEmployee) {
					const result = await deleteMutation.mutateAsync(selectedEmployee.id)
					setChangesData(result)
					setShowChangesModal(true)
					setSelectedEmployee(null)
				}
			},
		})
	}

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
					<Button type='link' danger onClick={() => handleDelete(record)}>
						Уволить
					</Button>
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

			<Modal
				title='Информация о перераспределении'
				open={showChangesModal}
				onCancel={() => setShowChangesModal(false)}
				footer={[
					<Button key="close" onClick={() => setShowChangesModal(false)}>
						Закрыть
					</Button>
				]}
				icon={<InfoCircleOutlined />}
			>
				{changesData && (
					<div className="space-y-4">
						<div>
							<Text strong>Уволенный сотрудник:</Text>
							<p>{changesData.deletedEmployeeName}</p>
							<p>Должность: {changesData.positionDescription}</p>
							<p>Аптека: {changesData.pharmacyAddress}</p>
						</div>
						
						<div>
							<Text strong>Перераспределенные задачи:</Text>
							{changesData.changes.length > 0 ? (
								<ul className="list-disc pl-5">
									{changesData.changes.map((change, index) => (
										<li key={index}>
											{change.entityType === 'ORDER' ? 'Заказ' : 'Продажа'} #{change.entityId} 
											(роль: {change.role}) передан сотруднику {change.newEmployeeName}
										</li>
									))}
								</ul>
							) : (
								<p>Нет перераспределенных задач</p>
							)}
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default Employees
