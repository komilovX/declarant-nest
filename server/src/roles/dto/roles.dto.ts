import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  role: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  description: string

  @IsArray()
  pages: string[]
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
