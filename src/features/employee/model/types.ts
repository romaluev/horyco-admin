export interface IEmployee {
  id: number;
  phone: string;
  password: string;
  fullName: string;
  photoUrl?: string;
  branchId: number;
}

export interface IEmployeeRequest {
  phone: string;
  password: string;
  fullName: string;
  branchId: number;
}
