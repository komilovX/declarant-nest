import { PartialType } from '@nestjs/mapped-types'
import { SignUpCredentialsDto } from './auth-credentials.dto'

export class UpdateUserDto extends PartialType(SignUpCredentialsDto) {}
