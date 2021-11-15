import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator'

export class CreateEventDto {
  @IsString()
  title: string

  @IsBoolean()
  allDay: boolean

  @IsDateString()
  start: Date

  @IsDateString()
  end: Date

  @IsOptional()
  backgroundColor?: string
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
