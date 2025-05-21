import { Card, Col, Row, Statistic, Table } from 'antd'
import type { EmployeesReport } from '../../types/report'

interface EmployeesReportProps {
	data: EmployeesReport
}

const EmployeesReport: React.FC<EmployeesReportProps> = ({ data }) => {
	const employeesByPositionColumns = [
		{
			title: 'Должность',
			dataIndex: 'position',
			key: 'position',
		},
		{
			title: 'Количество',
			dataIndex: 'count',
			key: 'count',
		},
	]

	const topEmployeesColumns = [
		{
			title: 'Имя',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Должность',
			dataIndex: 'position',
			key: 'position',
		},
		{
			title: 'Количество продаж',
			dataIndex: 'salesCount',
			key: 'salesCount',
		},
		{
			title: 'Общая выручка',
			dataIndex: 'totalRevenue',
			key: 'totalRevenue',
			render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
		},
	]

	const employeesByPharmacyColumns = [
		{
			title: 'Аптека',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
		},
		{
			title: 'Количество сотрудников',
			dataIndex: 'employeeCount',
			key: 'employeeCount',
		},
	]

	return (
		<div className='space-y-6'>
			<Row gutter={16}>
				<Col span={24}>
					<Card>
						<Statistic
							title='Всего сотрудников'
							value={data.totalEmployees}
							precision={0}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Сотрудники по должностям'>
				<Table
					columns={employeesByPositionColumns}
					dataSource={data.employeesByPosition}
					rowKey='position'
					pagination={false}
				/>
			</Card>

			<Card title='Топ сотрудников по продажам'>
				<Table
					columns={topEmployeesColumns}
					dataSource={data.topEmployees}
					rowKey='name'
					pagination={false}
				/>
			</Card>

			<Card title='Сотрудники по аптекам'>
				<Table
					columns={employeesByPharmacyColumns}
					dataSource={data.employeesByPharmacy}
					rowKey='pharmacyAddress'
					pagination={false}
				/>
			</Card>
		</div>
	)
}

export default EmployeesReport
