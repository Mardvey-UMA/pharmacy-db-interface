import { Line } from '@ant-design/plots'
import {
	Card,
	Col,
	DatePicker,
	Radio,
	Row,
	Select,
	Space,
	Spin,
	Statistic,
	Table,
} from 'antd'
import { format } from 'date-fns'
import type { Dayjs } from 'dayjs'
import React, { useMemo, useState } from 'react'
import { usePharmacies } from '../hooks/usePharmacies'
import { useSalesReport } from '../hooks/useReports'
import type { ReportFilterDto } from '../types/report'

const { RangePicker } = DatePicker

type ChartType = 'quantity' | 'revenue'

const Reports: React.FC = () => {
	const [filter, setFilter] = useState<ReportFilterDto>({
		reportType: 'sales',
	})
	const [chartType, setChartType] = useState<ChartType>('quantity')

	const { data: pharmacies } = usePharmacies()
	const { data: salesReport, isLoading: isLoadingSales } =
		useSalesReport(filter)

	const handleDateRangeChange = (
		dates: [Dayjs, Dayjs] | null,
		dateStrings: [string, string]
	) => {
		if (dates) {
			setFilter({
				...filter,
				fromDate: dateStrings[0],
				toDate: dateStrings[1],
			})
		} else {
			setFilter(prev => {
				const { fromDate, toDate, ...rest } = prev
				return rest
			})
		}
	}

	const handlePharmacyChange = (value: number | null) => {
		if (value) {
			setFilter({ ...filter, pharmacyId: value })
		} else {
			setFilter(prev => {
				const { pharmacyId, ...rest } = prev
				return rest
			})
		}
	}

	const renderSalesChart = () => {
		if (!salesReport) return null

		const data = salesReport.salesByDay.map(item => ({
			date: item.date,
			value: chartType === 'quantity' ? item.sales : item.revenue,
			type: chartType === 'quantity' ? 'Количество продаж' : 'Выручка',
		}))

		const config = {
			data,
			xField: 'date',
			yField: 'value',
			seriesField: 'type',
			smooth: true,
			animation: {
				appear: {
					animation: 'path-in',
					duration: 1000,
				},
			},
			point: {
				size: 5,
				shape: 'diamond',
			},
			tooltip: {
				formatter: (datum: { type: string; value: number }) => {
					return {
						name: datum.type,
						value:
							chartType === 'quantity'
								? `${datum.value} шт.`
								: `${datum.value.toLocaleString('ru-RU')} ₽`,
					}
				},
			},
		}

		return <Line {...config} />
	}

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
			sorter: (a: any, b: any) => a.revenue - b.revenue,
			defaultSortOrder: 'descend',
		},
	]

	const topSalesByDay = useMemo(() => {
		if (!salesReport) return []
		return [...salesReport.salesByDay]
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 5)
	}, [salesReport])

	return (
		<div className='p-6'>
			<Card className='mb-6'>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<Space size='middle'>
						<RangePicker onChange={handleDateRangeChange} />
						<Select
							allowClear
							placeholder='Выберите аптеку'
							style={{ width: 200 }}
							onChange={handlePharmacyChange}
						>
							{pharmacies?.map(pharmacy => (
								<Select.Option key={pharmacy.id} value={pharmacy.id}>
									{pharmacy.pharmacyAddress}
								</Select.Option>
							))}
						</Select>
					</Space>
					<Radio.Group
						value={chartType}
						onChange={e => setChartType(e.target.value)}
						buttonStyle='solid'
					>
						<Radio.Button value='quantity'>По количеству</Radio.Button>
						<Radio.Button value='revenue'>По выручке</Radio.Button>
					</Radio.Group>
				</Space>
			</Card>

			{isLoadingSales ? (
				<Spin size='large' className='flex justify-center p-8' />
			) : (
				salesReport && (
					<>
						<Row gutter={16} className='mb-6'>
							<Col span={8}>
								<Card>
									<Statistic
										title='Всего продаж'
										value={salesReport.totalSales}
										precision={0}
									/>
								</Card>
							</Col>
							<Col span={8}>
								<Card>
									<Statistic
										title='Общая выручка'
										value={salesReport.totalRevenue}
										precision={2}
										suffix=' ₽'
									/>
								</Card>
							</Col>
							<Col span={8}>
								<Card>
									<Statistic
										title='Средний чек'
										value={salesReport.averageCheck}
										precision={2}
										suffix=' ₽'
									/>
								</Card>
							</Col>
						</Row>

						<Card className='mb-6'>{renderSalesChart()}</Card>

						<Row gutter={16}>
							<Col span={12}>
								<Card title='Топ продаваемых лекарств'>
									<Table
										columns={topMedicationsColumns}
										dataSource={salesReport.topMedications}
										rowKey='name'
										pagination={false}
									/>
								</Card>
							</Col>
							<Col span={12}>
								<Card title='Топ-5 дней по выручке'>
									<Table
										columns={salesByDayColumns}
										dataSource={topSalesByDay}
										rowKey='date'
										pagination={false}
									/>
								</Card>
							</Col>
						</Row>
					</>
				)
			)}
		</div>
	)
}

export default Reports
