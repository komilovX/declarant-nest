import { DocumenTypes, OrderStatuses, UserRoles } from './enums'

export interface UserPagesI {
  id: number
  name: string
}

export interface UserRoleI {
  role: UserRoles
  name: string
  description?: string
  pages: UserPagesI[]
}

export interface AuthI {
  id: string
  name: string
  role: UserRoleI
}
export interface LoginData {
  login: string
  password: string
}

export interface UsersI {
  name: string
  login?: string
  role: UserRoles
  username?: string
}

export interface Clients {
  id?: number
  date: Date
  name: string
  info: string
}

export interface DocumentTypesI {
  id?: number
  number: number
  name: string
  info: string
  types: any
  departments: any
}

export interface DocumentsI {
  comment?: string
  currency?: string
  documentType: DocumenTypes
  files: string[]
  id: number
  number?: string
  price?: number
}

export interface Departments {
  id?: number
  name: string
}

export interface Shippers {
  id?: number
  name: string
}

export interface ProductI {
  id?: number
  name: string
}

export interface OrderPriceI {
  comingDollar?: number
  comingInvoice?: number
  comingSum?: number
  course?: number
  id?: number
  percent?: number
}

export interface OrdersI {
  id?: number
  user: UsersI
  declarant: UsersI
  documents?: DocumentsI
  orderPrice: OrderPriceI
  date: Date
  date_income: Date
  container: string
  product: ProductI
  post_number: string
  client: Clients
  shipper: Shippers
  status: OrderStatuses
  archived: boolean
  deleted: boolean
}
