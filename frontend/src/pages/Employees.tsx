import {
	ArrowRightOutlined,
	CheckCircleOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import {
	Button,
	Card,
	Input,
	List,
	Modal,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd'
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
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	)
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
				const result = await deleteMutation.mutateAsync(employee.id)
				setChangesData(result)
				setShowChangesModal(true)
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
				title={
					<Space>
						<InfoCircleOutlined style={{ color: '#1890ff' }} />
						<span>Информация о перераспределении</span>
					</Space>
				}
				open={showChangesModal}
				onCancel={() => setShowChangesModal(false)}
				footer={[
					<Button
						key='close'
						type='primary'
						onClick={() => setShowChangesModal(false)}
					>
						Закрыть
					</Button>,
				]}
				width={700}
			>
				{changesData && (
					<div className='space-y-6'>
						<Card bordered={false} className='bg-gray-50'>
							<Space direction='vertical' size='middle' className='w-full'>
								<div className='flex items-center justify-between'>
									<div>
										<Typography.Title level={5} className='mb-0'>
											Уволенный сотрудник
										</Typography.Title>
										<Typography.Text type='secondary'>
											Информация о сотруднике и его должности
										</Typography.Text>
									</div>
									<Tag color='red' icon={<ExclamationCircleOutlined />}>
										Уволен
									</Tag>
								</div>

								<List
									itemLayout='horizontal'
									dataSource={[
										{
											label: 'ФИО',
											value: changesData.deletedEmployeeName,
										},
										{
											label: 'Должность',
											value: changesData.positionDescription,
										},
										{
											label: 'Аптека',
											value: changesData.pharmacyAddress,
										},
									]}
									renderItem={item => (
										<List.Item>
											<div className='flex justify-between w-full'>
												<Typography.Text strong>{item.label}:</Typography.Text>
												<Typography.Text>{item.value}</Typography.Text>
											</div>
										</List.Item>
									)}
								/>
							</Space>
						</Card>

						<Card bordered={false} className='bg-gray-50'>
							<Space direction='vertical' size='middle' className='w-full'>
								<div className='flex items-center justify-between'>
									<div>
										<Typography.Title level={5} className='mb-0'>
											Перераспределенные задачи
										</Typography.Title>
										<Typography.Text type='secondary'>
											Список задач, переданных другим сотрудникам
										</Typography.Text>
									</div>
									<Tag color='blue' icon={<CheckCircleOutlined />}>
										{changesData.changes.length} задач
									</Tag>
								</div>

								{changesData.changes.length > 0 ? (
									<List
										itemLayout='horizontal'
										dataSource={changesData.changes}
										renderItem={change => (
											<List.Item>
												<div className='flex items-center justify-between w-full'>
													<Space>
														<Tag
															color={
																change.entityType === 'ORDER' ? 'green' : 'blue'
															}
														>
															{change.entityType === 'ORDER'
																? 'Заказ'
																: 'Продажа'}{' '}
															#{change.entityId}
														</Tag>
														<Tag color='purple'>{change.role}</Tag>
													</Space>
													<Space>
														<Typography.Text type='secondary'>
															передан
														</Typography.Text>
														<ArrowRightOutlined style={{ color: '#1890ff' }} />
														<Tooltip title='Новый ответственный'>
															<Tag color='success'>
																{change.newEmployeeName}
															</Tag>
														</Tooltip>
													</Space>
												</div>
											</List.Item>
										)}
									/>
								) : (
									<div className='text-center py-4'>
										<Typography.Text type='secondary'>
											Нет перераспределенных задач
										</Typography.Text>
									</div>
								)}
							</Space>
						</Card>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default Employees
