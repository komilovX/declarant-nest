import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreatePageDto {
  @IsNotEmpty()
  @IsOptional()
  name: string
}

export class UpdatePageDto {
  name?: string
}
