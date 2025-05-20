export interface Employee {
  id: number;
  fullName: string;
  passport: string;
  positionDescription: string;
  finalSalary: number;
  pharmacyAddress: string;
}

export interface EmployeeCreateDto {
  fullName: string;
  passport: string;
  pharmacyId: number;
  positionId: number;
}

export interface EmployeeUpdateDto {
  fullName: string;
  passport: string;
  positionId: number;
}