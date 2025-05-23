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
	username: string
	fullName: string
	role: string
	discountCardId: number
	token: string
}

export interface User {
	id: number
	role: 'ADMIN' | 'USER'
	fullName: string
	username: string
	discountCardId: number
	discount: number
}
