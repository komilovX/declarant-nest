import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsIn, IsString } from 'class-validator'
import { DocumentTypes } from 'src/utils/lib/types'

export class CreateDocumentTypeDto {
  @IsString()
  name: string

  @IsString()
  number: string

  @IsString()
  info: string

  @IsArray()
  @IsIn(
    [
      DocumentTypes.DECLARANT,
      DocumentTypes.INCOMING,
      DocumentTypes.DECORATED,
      DocumentTypes.SERVICE,
    ],
    { each: true },
  )
  types: string[]

  @IsArray()
  departments: number[]
}

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {}
