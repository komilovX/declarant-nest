import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string
}
