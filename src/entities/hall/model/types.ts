export interface IHall {
  id: number
  name: string
  floor: number
  createdAt?: string
  updatedAt?: string
}

export interface IHallRequest {
  name: string
  floor: number
}

export interface ITable {
  id: number
  name: string
  hallId: number
  seats: number
  position: {
    x: number
    y: number
  }
  createdAt?: string
  updatedAt?: string
}

export interface ITableRequest {
  name: string
  hallId: number
  seats: number
  position: {
    x: number
    y: number
  }
}
