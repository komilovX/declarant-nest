import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreatePageDto {
  @IsNotEmpty()
  value: string

  @IsOptional()
  create: boolean

  @IsOptional()
  read: boolean

  @IsOptional()
  update: boolean

  @IsOptional()
  delete: boolean
}

export class UpdatePageDto extends PartialType(CreatePageDto) {}
