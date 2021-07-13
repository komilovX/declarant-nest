import { IsOptional } from 'class-validator'
import { DocumentStatus } from 'src/utils/lib/types'
import { DocumentPriceI } from './create-document.dto'

export class UpdateDocumentDto {
  @IsOptional()
  price?: DocumentPriceI[]

  @IsOptional()
  number?: string

  @IsOptional()
  comment?: string

  @IsOptional()
  status?: DocumentStatus

  @IsOptional()
  returnText?: string
}
