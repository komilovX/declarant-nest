export enum Currency {
  USD = 'usd',
  SUM = 'sum',
  INVOICE = 'invoice',
}

export enum OrderStatus {
  NEW = 'NEW',
  INSPECTION = 'INSPECTION',
  DOCUMENT = 'DOCUMENT',
  REGISTRATION = 'REGISTRATION',
  FINISHED = 'FINISHED',
}

export enum DocumentTypes {
  INCOMING = 'incoming',
  DECLARANT = 'declarant',
  DECORATED = 'decorated',
  SERVICE = 'service',
}

export enum UserRoles {
  ADMIN = 'admin',
  DECLARANT = 'declarant',
  MANAGER = 'manager',
}

export enum DocumentStatus {
  NEW = 'NEW',
  TASK = 'TASK',
  DONE = 'DONE',
  RETURNED = 'RETURNED',
  FINISHED = 'FINISHED',
}
