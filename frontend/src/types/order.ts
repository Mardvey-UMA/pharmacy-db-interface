export interface Order {
  id: number;
  orderAddress: string;
  orderDate: string;
  status: string;
  clientId: number;
  clientName: string;
  total: number;
}

export interface OrderDetails extends Order {
  medications: OrderMedication[];
  assemblerIds: number[];
  courierIds: number[];
}

export interface OrderMedication {
  id: number;
  quantity: number;
  price: number;
  medicationId: number;
  medicationName: string;
}

export interface OrderFilterDto {
  status?: string;
  minSum?: number;
  maxSum?: number;
  fromDate?: string;
  toDate?: string;
  clientId?: number;
}

export interface OrderCreateDto {
  clientId: number;
  pharmacyId: number;
  orderAddress: string;
  medications: OrderMedicationCreate[];
  assemblerIds: number[];
  courierIds: number[];
}

export interface OrderMedicationCreate {
  medicationId: number;
  quantity: number;
  price: number;
}

export interface OrderStatusUpdateDto {
  newStatus: string;
  courierId?: number;
}