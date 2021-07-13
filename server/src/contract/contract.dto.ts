import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'

export class CreateContractDto {
  @IsNotEmpty()
  documentTypeId: number
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}

export class CreateContractClientDto {
  @IsNotEmpty()
  documentTypeId: number

  @IsNotEmpty()
  clientId: number
}

export class CreateContractShipperDto {
  @IsNotEmpty()
  shipperId: number

  @IsNotEmpty()
  clientId: number
}

export class ContractNumberDto {
  @IsNotEmpty()
  shipperId: number

  @IsNotEmpty()
  number: string
}
