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
	userId: number
	role: 'ADMIN' | 'USER'
	username: string
	discountCardId: number
	discount: number
}

export interface User {
	id: number
	role: 'ADMIN' | 'USER'
	fullName: string
	username: string
	discountCardId: number
	discount: number
}
