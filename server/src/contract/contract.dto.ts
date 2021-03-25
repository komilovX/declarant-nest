import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'

export class CreateContractDto {
  @IsNotEmpty()
  documentTypeId: number

  @IsNotEmpty()
  clientId: number

  @IsNotEmpty()
  shipperId: number
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
