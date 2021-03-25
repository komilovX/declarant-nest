import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateOrderDto {
  @IsOptional()
  documents?: string

  @IsNotEmpty()
  declarantId: string

  @IsNotEmpty()
  date: Date

  @IsNotEmpty()
  date_income: Date

  @IsString()
  container: string

  @IsNotEmpty()
  productId: string

  @IsNotEmpty()
  post_number: string

  @IsNotEmpty()
  clientId: string

  @IsNotEmpty()
  shipperId: string
}

export class UpdateOrderDto {
  @IsNotEmpty()
  declarantId: string

  @IsOptional()
  date?: Date

  @IsOptional()
  date_income?: Date

  @IsOptional()
  container?: string

  @IsNotEmpty()
  productId: string

  @IsOptional()
  post_number?: string

  @IsNotEmpty()
  clientId: string

  @IsNotEmpty()
  shipperId: string
}

export class FindOrderGridDto {
  @IsObject()
  filter: { [key: string]: any }

  @IsObject()
  sort: { [key: string]: any }

  @IsNumber()
  page: number

  @IsNumber()
  limit: number
}

export interface CreateIncomingDocument {
  documentTypeId: number
  number?: string
  price?: number
  currency?: string
}
