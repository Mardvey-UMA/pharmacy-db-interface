import { Layout as AntLayout, Button, Menu } from 'antd'
import {
	Building2,
	FileBarChart,
	Package,
	Pill,
	ShoppingBag,
	ShoppingBasket,
	ShoppingCart,
	User,
	Users,
} from 'lucide-react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import BuyMedication from '../pages/BuyMedication'
import Cart from '../pages/Cart'
import Employees from '../pages/Employees'
import Login from '../pages/Login'
import Medications from '../pages/Medications'
import Orders from '../pages/Orders'
import Pharmacies from '../pages/Pharmacies'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import Reports from '../pages/Reports'
import Sales from '../pages/Sales'
import UserOrders from '../pages/UserOrders'
import { authService } from '../services/auth'

const { Header, Sider, Content } = AntLayout

const adminMenuItems = [
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

const userMenuItems = [
	{
		key: '/profile',
		icon: <User size={18} />,
		label: <Link to='/profile'>Личный кабинет</Link>,
	},
	{
		key: '/my-orders',
		icon: <ShoppingBag size={18} />,
		label: <Link to='/my-orders'>Мои заказы</Link>,
	},
	{
		key: '/cart',
		icon: <ShoppingBasket size={18} />,
		label: <Link to='/cart'>Корзина</Link>,
	},
	{
		key: '/buy-medication',
		icon: <Pill size={18} />,
		label: <Link to='/buy-medication'>Купить лекарство</Link>,
	},
]

function Layout() {
	const location = useLocation()
	const navigate = useNavigate()
	const isAuthenticated = authService.isAuthenticated()
	const isAdmin = authService.isAdmin()

	const handleLogout = () => {
		authService.logout()
		navigate('/login')
	}

	if (!isAuthenticated) {
		return (
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<Login />} />
			</Routes>
		)
	}

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Header
				style={{
					padding: '0 24px',
					background: '#fff',
					borderBottom: '1px solid #f0f0f0',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: '#4CAF50',
					}}
				>
					Система управления аптекой
				</div>
				<Button onClick={handleLogout}>Выйти</Button>
			</Header>
			<AntLayout>
				<Sider width={200} style={{ background: '#fff' }}>
					<Menu
						mode='inline'
						selectedKeys={[location.pathname]}
						style={{ height: '100%', borderRight: 0 }}
						items={isAdmin ? adminMenuItems : userMenuItems}
					/>
				</Sider>
				<Content style={{ padding: '24px', minHeight: 280 }}>
					<Routes>
						{isAdmin ? (
							<>
								<Route path='/employees' element={<Employees />} />
								<Route path='/pharmacies' element={<Pharmacies />} />
								<Route path='/sales' element={<Sales />} />
								<Route path='/orders' element={<Orders />} />
								<Route path='/medications' element={<Medications />} />
								<Route path='/reports' element={<Reports />} />
								<Route path='/' element={<Employees />} />
							</>
						) : (
							<>
								<Route path='/profile' element={<Profile />} />
								<Route path='/my-orders' element={<UserOrders />} />
								<Route path='/cart' element={<Cart />} />
								<Route path='/buy-medication' element={<BuyMedication />} />
								<Route path='/' element={<Profile />} />
							</>
						)}
					</Routes>
				</Content>
			</AntLayout>
		</AntLayout>
	)
}

export default Layout
