import { PartialType } from '@nestjs/mapped-types'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateClientDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  info?: string
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
