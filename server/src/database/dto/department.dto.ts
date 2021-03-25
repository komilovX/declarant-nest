import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
