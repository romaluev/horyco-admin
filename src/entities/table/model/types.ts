export interface ITable {
  id: number;
  name: string;
  size: number;
  shape: string;
  xPosition: number;
  yPosition: number;
  hallId: number;
  number: number;
  isAvailable: boolean;
}

export interface ICreateTableDto {
  name: string;
  size: number;
  shape: string;
  xPosition: number;
  yPosition: number;
  hallId: number;
  isAvailable: boolean;
  number: number;
}

export interface IUpdateTableDto {
  name?: string;
  size?: number;
  shape?: string;
  xPosition?: number;
  yPosition?: number;
  hallId?: number;
  isAvailable?: boolean;
  number: number;
}
