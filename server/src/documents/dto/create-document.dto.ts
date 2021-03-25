import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Currency } from 'src/utils/lib/types'

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  orderId: string

  declarantId?: string

  @IsNotEmpty()
  documentTypeId: string

  @IsNotEmpty()
  type: string

  @IsOptional()
  price?: number

  @IsOptional()
  number?: string

  @IsOptional()
  currency?: Currency

  @IsOptional()
  comment?: string
}
