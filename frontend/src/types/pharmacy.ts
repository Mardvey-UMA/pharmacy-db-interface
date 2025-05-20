export interface Pharmacy {
  id: number;
  pharmacyAddress: string;
}

export interface PharmacyDetails extends Pharmacy {
  employees: Employee[];
  supplies: Supply[];
  medications: MedicationInPharmacy[];
  sales: Sale[];
}

export interface Supply {
  id: number;
  supplyDate: string;
  supplyTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  accepted: boolean;
  vendorName: string;
}

export interface MedicationInPharmacy {
  id: number;
  name: string;
  form: string;
  expirationDate: string;
  price: number;
  quantity: number;
}

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