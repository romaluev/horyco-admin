export interface IHall {
  id: number
  name: string
  description: string
  capacity: number
  floor: number
  branchId: number
  branchName?: string
  tableCount: number
  activeTableCount?: number
  layout?: {
    width: number
    height: number
    gridSize: number
  }
  isActive: boolean
  createdAt: string
}

export interface ICreateHallDto {
  branchId: number
  name: string
  description: string
  capacity: number
  floor: number
}

export interface IUpdateHallDto {
  capacity?: number
  description?: string
  name?: string
  floor?: number
}

export interface ICanDeleteHallResponse {
  canDelete: boolean
  blockingReasons?: {
    tables?: string
  }
}
