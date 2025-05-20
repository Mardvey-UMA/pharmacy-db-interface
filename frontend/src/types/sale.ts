export interface Sale {
  id: number;
  saleDate: string;
  saleTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  employeeName: string;
  clientName: string;
  total: number;
}

export interface SaleDetails extends Sale {
  items: MedicationShort[];
}

export interface MedicationShort {
  name: string;
  quantity: number;
  price: number;
}

export interface SaleFilterDto {
  from?: string;
  to?: string;
  pharmacyId?: number;
}

export interface MedicationQuantity {
  medicationId: number;
  quantity: number;
}

export interface SaleRequest {
  pharmacyId: number;
  employeeId: number;
  medications: MedicationQuantity[];
  discountCardId?: number;
  prescriptionNumber?: string;
}