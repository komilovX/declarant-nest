import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateShipperDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class UpdateShipperDto {
  @IsOptional()
  @IsString()
  name?: string
}
