import { Card, Col, Row, Statistic, Table } from 'antd'
import { format } from 'date-fns'
import type { MedicationsReport } from '../../types/report'

interface MedicationsReportProps {
	data: MedicationsReport
}

const MedicationsReport: React.FC<MedicationsReportProps> = ({ data }) => {
	const lowStockColumns = [
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
			title: 'Аптека',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
		},
	]

	const expiringColumns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Срок годности',
			dataIndex: 'expirationDate',
			key: 'expirationDate',
			render: (date: string) => format(new Date(date), 'dd.MM.yyyy'),
		},
		{
			title: 'Количество',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Аптека',
			dataIndex: 'pharmacyAddress',
			key: 'pharmacyAddress',
		},
	]

	const topMedicationsColumns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Общее количество',
			dataIndex: 'totalQuantity',
			key: 'totalQuantity',
		},
		{
			title: 'Количество аптек',
			dataIndex: 'pharmaciesCount',
			key: 'pharmaciesCount',
		},
	]

	return (
		<div className='space-y-6'>
			<Row gutter={16}>
				<Col span={24}>
					<Card>
						<Statistic
							title='Всего лекарств'
							value={data.totalMedications}
							precision={0}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Лекарства с низким запасом'>
				<Table
					columns={lowStockColumns}
					dataSource={data.lowStockMedications}
					rowKey='name'
					pagination={false}
				/>
			</Card>

			<Card title='Лекарства с истекающим сроком годности'>
				<Table
					columns={expiringColumns}
					dataSource={data.expiringMedications}
					rowKey='name'
					pagination={false}
				/>
			</Card>

			<Card title='Топ лекарств по наличию'>
				<Table
					columns={topMedicationsColumns}
					dataSource={data.topMedications}
					rowKey='name'
					pagination={false}
				/>
			</Card>
		</div>
	)
}

export default MedicationsReport
