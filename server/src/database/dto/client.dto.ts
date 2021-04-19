import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateClientDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  info?: string

  @IsArray()
  directors: string[]
}

export interface ClientDirector {
  id?: number
  name: string
}

export class UpdateClientDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  info?: string

  @IsArray()
  directors: ClientDirector[]
}
