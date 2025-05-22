import axios from 'axios'
import {
	AuthResponse,
	LoginRequestDto,
	RegisterRequestDto,
} from '../types/auth'

const API_URL = 'http://localhost:8080/api'

export const authService = {
	async login(data: LoginRequestDto): Promise<AuthResponse> {
		const response = await axios.post(`${API_URL}/auth/login`, data)
		return response.data
	},

	async register(data: RegisterRequestDto): Promise<AuthResponse> {
		const response = await axios.post(`${API_URL}/auth/register`, data)
		return response.data
	},

	setAuthData(data: AuthResponse) {
		localStorage.setItem('user', JSON.stringify(data))
	},

	getAuthData(): AuthResponse | null {
		const data = localStorage.getItem('user')
		return data ? JSON.parse(data) : null
	},

	logout() {
		localStorage.removeItem('user')
	},

	isAuthenticated(): boolean {
		return !!this.getAuthData()
	},

	isAdmin(): boolean {
		const user = this.getAuthData()
		return user?.role === 'ADMIN'
	},
}
