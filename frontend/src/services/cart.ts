import type { MedicationInPharmacy } from '../types/medication'

export interface CartItem extends MedicationInPharmacy {
	quantity: number
}

class CartService {
	private readonly CART_KEY = 'pharmacy_cart'

	getCart(): CartItem[] {
		const cart = localStorage.getItem(this.CART_KEY)
		return cart ? JSON.parse(cart) : []
	}

	addToCart(item: MedicationInPharmacy, quantity: number = 1) {
		const cart = this.getCart()
		const existingItem = cart.find(
			cartItem =>
				cartItem.id === item.id && cartItem.pharmacyId === item.pharmacyId
		)

		if (existingItem) {
			existingItem.quantity += quantity
		} else {
			cart.push({ ...item, quantity })
		}

		localStorage.setItem(this.CART_KEY, JSON.stringify(cart))
	}

	removeFromCart(itemId: number, pharmacyId: number) {
		const cart = this.getCart()
		const updatedCart = cart.filter(
			item => !(item.id === itemId && item.pharmacyId === pharmacyId)
		)
		localStorage.setItem(this.CART_KEY, JSON.stringify(updatedCart))
	}

	updateQuantity(itemId: number, pharmacyId: number, quantity: number) {
		const cart = this.getCart()
		const item = cart.find(
			item => item.id === itemId && item.pharmacyId === pharmacyId
		)
		if (item) {
			item.quantity = quantity
			localStorage.setItem(this.CART_KEY, JSON.stringify(cart))
		}
	}

	clearCart() {
		localStorage.removeItem(this.CART_KEY)
	}

	getTotal(): number {
		const cart = this.getCart()
		return cart.reduce((total, item) => total + item.price * item.quantity, 0)
	}
}

export const cartService = new CartService()
