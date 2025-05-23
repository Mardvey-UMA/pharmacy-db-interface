import {
	BarChartOutlined,
	LogoutOutlined,
	MedicineBoxOutlined,
	RedditOutlined,
	ShopOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { Layout as AntLayout, Button, Menu } from 'antd'
import {
	Link,
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router-dom'
import Cart from '../pages/Cart'
import Catalog from '../pages/Catalog'
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
import UserSales from '../pages/UserSales'
import { authService } from '../services/auth'

const { Header, Sider, Content } = AntLayout

const adminMenuItems = [
	{
		key: 'medications',
		icon: <MedicineBoxOutlined />,
		label: <Link to='/admin/medications'>Лекарства</Link>,
	},
	{
		key: 'pharmacies',
		icon: <ShopOutlined />,
		label: <Link to='/admin/pharmacies'>Аптеки</Link>,
	},
	{
		key: 'employees',
		icon: <TeamOutlined />,
		label: <Link to='/admin/employees'>Сотрудники</Link>,
	},
	{
		key: 'sales',
		icon: <ShoppingOutlined />,
		label: <Link to='/admin/sales'>Продажи</Link>,
	},
	{
		key: 'orders',
		icon: <ShoppingOutlined />,
		label: <Link to='/admin/orders'>Заказы</Link>,
	},
	{
		key: 'reports',
		icon: <BarChartOutlined />,
		label: <Link to='/admin/reports'>Отчеты</Link>,
	},
]

const userMenuItems = [
	{
		key: 'profile',
		icon: <UserOutlined />,
		label: <Link to='/profile'>Личный кабинет</Link>,
	},
	{
		key: 'catalog',
		icon: <MedicineBoxOutlined />,
		label: <Link to='/catalog'>Каталог</Link>,
	},
	{
		key: 'cart',
		icon: <ShoppingCartOutlined />,
		label: <Link to='/cart'>Корзина</Link>,
	},
	{
		key: 'orders',
		icon: <ShoppingOutlined />,
		label: <Link to='/my-orders'>Мои заказы</Link>,
	},
	{
		key: 'sales',
		icon: <RedditOutlined />,
		label: <Link to='/my-sales'>Мои покупки</Link>,
	},
]

const Layout: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const isAdmin = authService.getAuthData()?.role === 'ADMIN'
	const menuItems = isAdmin ? adminMenuItems : userMenuItems

	const handleLogout = () => {
		authService.logout()
		navigate('/login')
	}

	if (!authService.getAuthData()) {
		return (
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<Navigate to='/login' replace />} />
			</Routes>
		)
	}

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Sider width={250} theme='light'>
				<div className='p-4'>
					<div className='flex items-center gap-2 mb-4'>
						<UserOutlined className='text-xl' />
						<span className='font-medium'>
							{authService.getAuthData()?.username}
						</span>
					</div>
					<Button
						type='text'
						icon={<LogoutOutlined />}
						onClick={handleLogout}
						className='w-full text-left'
					>
						Выйти
					</Button>
				</div>
				<Menu
					mode='inline'
					selectedKeys={[location.pathname.split('/').pop() || '']}
					items={menuItems}
				/>
			</Sider>
			<AntLayout>
				<Header className='bg-white p-0' />
				<Content className='m-6'>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='*' element={<Navigate to='/login' replace />} />
						<Route path='/admin'>
							<Route path='medications' element={<Medications />} />
							<Route path='pharmacies' element={<Pharmacies />} />
							<Route path='employees' element={<Employees />} />
							<Route path='sales' element={<Sales />} />
							<Route path='orders' element={<Orders />} />
							<Route path='reports' element={<Reports />} />
						</Route>
						<Route path='/profile' element={<Profile />} />
						<Route path='/catalog' element={<Catalog />} />
						<Route path='/cart' element={<Cart />} />
						<Route path='/my-orders' element={<UserOrders />} />
						<Route path='/my-sales' element={<UserSales />} />
					</Routes>
				</Content>
			</AntLayout>
		</AntLayout>
	)
}

export default Layout
