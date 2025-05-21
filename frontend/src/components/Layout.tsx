import { Layout as AntLayout, Menu } from 'antd'
import {
	Building2,
	FileBarChart,
	Package,
	Pill,
	ShoppingCart,
	Users,
} from 'lucide-react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Employees from '../pages/Employees'
import Medications from '../pages/Medications'
import Orders from '../pages/Orders'
import Pharmacies from '../pages/Pharmacies'
import Reports from '../pages/Reports'
import Sales from '../pages/Sales'

const { Header, Sider, Content } = AntLayout

const menuItems = [
	{
		key: '/employees',
		icon: <Users size={18} />,
		label: <Link to='/employees'>Сотрудники</Link>,
	},
	{
		key: '/pharmacies',
		icon: <Building2 size={18} />,
		label: <Link to='/pharmacies'>Аптеки</Link>,
	},
	{
		key: '/sales',
		icon: <ShoppingCart size={18} />,
		label: <Link to='/sales'>Продажи</Link>,
	},
	{
		key: '/orders',
		icon: <Package size={18} />,
		label: <Link to='/orders'>Заказы</Link>,
	},
	{
		key: '/medications',
		icon: <Pill size={18} />,
		label: <Link to='/medications'>Лекарства</Link>,
	},
	{
		key: '/reports',
		icon: <FileBarChart size={18} />,
		label: <Link to='/reports'>Отчеты</Link>,
	},
]

function Layout() {
	const location = useLocation()

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Header
				style={{
					padding: 0,
					background: '#fff',
					borderBottom: '1px solid #f0f0f0',
				}}
			>
				<div
					style={{
						padding: '0 24px',
						fontSize: '18px',
						fontWeight: 'bold',
						color: '#4CAF50',
					}}
				>
					Система управления аптекой
				</div>
			</Header>
			<AntLayout>
				<Sider width={200} style={{ background: '#fff' }}>
					<Menu
						mode='inline'
						selectedKeys={[location.pathname]}
						style={{ height: '100%', borderRight: 0 }}
						items={menuItems}
					/>
				</Sider>
				<Content style={{ padding: '24px', minHeight: 280 }}>
					<Routes>
						<Route path='/employees' element={<Employees />} />
						<Route path='/pharmacies' element={<Pharmacies />} />
						<Route path='/sales' element={<Sales />} />
						<Route path='/orders' element={<Orders />} />
						<Route path='/medications' element={<Medications />} />
						<Route path='/reports' element={<Reports />} />
						<Route path='/' element={<Employees />} />
					</Routes>
				</Content>
			</AntLayout>
		</AntLayout>
	)
}

export default Layout
