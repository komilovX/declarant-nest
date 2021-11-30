import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Currency, DocumentTypes } from 'src/utils/lib/types'

export interface DocumentPriceI {
  id?: number
  price: number
  currency: Currency
}

export interface PriceI {
  price: string
  currency: Currency
}

export class CreateDocumentDto {
  @IsNotEmpty()
  orderId: string

  declarantId?: string

  @IsNotEmpty()
  documentTypeId: string

  @IsNotEmpty()
  type: string

  @IsOptional()
  price?: number

  @IsOptional()
  currency?: Currency

  @IsOptional()
  number?: string

  @IsOptional()
  comment?: string

  @IsOptional()
  postDate?: Date

  @IsOptional()
  referenceNumber?: string
}

export class GiveTaskDocumentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number

  @IsNumber()
  declarantId: number

  @IsNotEmpty()
  documentTypeId: number

  @IsNotEmpty()
  expire: Date

  @IsString()
  type: DocumentTypes

  @IsOptional()
  taskText?: string
}
