import { Card, Col, Row, Statistic, Table } from 'antd'
import { format } from 'date-fns'
import type { SalesReport } from '../../types/report'

interface SalesReportProps {
	data: SalesReport
}

const SalesReport: React.FC<SalesReportProps> = ({ data }) => {
	const topMedicationsColumns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Количество',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Выручка',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
		},
	]

	const salesByDayColumns = [
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
		},
		{
			title: 'Продажи',
			dataIndex: 'sales',
			key: 'sales',
		},
		{
			title: 'Выручка',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
		},
	]

	return (
		<div className='space-y-6'>
			<Row gutter={16}>
				<Col span={8}>
					<Card>
						<Statistic
							title='Всего продаж'
							value={data.totalSales}
							precision={0}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Общая выручка'
							value={data.totalRevenue}
							precision={2}
							suffix=' ₽'
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Средний чек'
							value={data.averageCheck}
							precision={2}
							suffix=' ₽'
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Топ продаваемых лекарств'>
				<Table
					columns={topMedicationsColumns}
					dataSource={data.topMedications}
					rowKey='name'
					pagination={false}
				/>
			</Card>

			<Card title='Продажи по дням'>
				<Table
					columns={salesByDayColumns}
					dataSource={data.salesByDay}
					rowKey='date'
					pagination={false}
				/>
			</Card>
		</div>
	)
}

export default SalesReport
