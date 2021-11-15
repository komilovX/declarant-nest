import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
import { Currency } from 'src/utils/lib/types'

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
  post_date: Date

  @IsNotEmpty()
  clientId: string

  @IsNotEmpty()
  clientDirectorId: string

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
  clientDirectorId: string

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
  currency?: Currency
}

export interface UpdateOrderDefaultItems {
  status?: string
  date?: Date
  date_income?: Date
  container?: string
  archived?: boolean
  deleted?: boolean
}

export class OrderPriceDto {
  @IsNumber()
  id: number

  @IsOptional()
  @IsNumber()
  course: number

  @IsOptional()
  @IsNumber()
  percent: number

  @IsOptional()
  @IsNumber()
  comingSum: number

  @IsOptional()
  @IsNumber()
  comingDollar: number

  @IsOptional()
  @IsNumber()
  comingInvoice: number
}
