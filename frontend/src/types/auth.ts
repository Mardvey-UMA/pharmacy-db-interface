export interface LoginRequestDto {
	username: string
	password: string
}

export interface RegisterRequestDto {
	fullName: string
	username: string
	password: string
}

export interface AuthResponse {
	id: number
	role: 'ADMIN' | 'USER'
}

export interface User {
	id: number
	role: 'ADMIN' | 'USER'
	fullName: string
	username: string
}
