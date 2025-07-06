export interface IEmployee {
  id: number;
  phone: string;
  password: string;
  fullName: string;
  photoUrl: string | null;
  branchId: number;
}

export interface IEmployeeDto {
  phone: string;
  password: string;
  fullName: string;
  branchId: number;
}
