import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { UserRoles } from 'src/utils/lib/types'

export class SignUpCredentialsDto {
  @IsString()
  name: string

  @IsString()
  @MinLength(4, { message: 'минимальная длина логина - 4' })
  @MaxLength(20, { message: 'максимальная длина логина 20' })
  login: string

  @IsString()
  username: string

  @IsString()
  @MinLength(4, { message: 'минимальная длина пароля - 4' })
  @MaxLength(20, { message: 'максимальная длина пароля 20' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Пароль слишком слабый',
  })
  password: string

  @IsString()
  @IsIn([UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.DECLARANT])
  role: string
}

export class SignInCredentialsDto {
  @IsString()
  login: string

  @IsString()
  password: string
}
