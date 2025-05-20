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
import Orders from '../pages/Orders'
import Pharmacies from '../pages/Pharmacies'
import Sales from '../pages/Sales'
// import Medications from '../pages/Medications'
// import Reports from '../pages/Reports'

const { Header, Sider, Content } = AntLayout

const menuItems = [
	{
		key: '/employees',
		icon: <Users size={18} />,
		label: <Link to='/employees'>Employees</Link>,
	},
	{
		key: '/pharmacies',
		icon: <Building2 size={18} />,
		label: <Link to='/pharmacies'>Pharmacies</Link>,
	},
	{
		key: '/sales',
		icon: <ShoppingCart size={18} />,
		label: <Link to='/sales'>Sales</Link>,
	},
	{
		key: '/orders',
		icon: <Package size={18} />,
		label: <Link to='/orders'>Orders</Link>,
	},
	{
		key: '/medications',
		icon: <Pill size={18} />,
		label: <Link to='/medications'>Medications</Link>,
	},
	{
		key: '/reports',
		icon: <FileBarChart size={18} />,
		label: <Link to='/reports'>Reports</Link>,
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
					Pharmacy Management System
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
						<Route path='/' element={<Employees />} />
					</Routes>
				</Content>
			</AntLayout>
		</AntLayout>
	)
}

export default Layout
