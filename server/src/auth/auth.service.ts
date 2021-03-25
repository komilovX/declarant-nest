import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRoles } from 'src/utils/lib/types'
import { AuthRepository } from './auth.repository'
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    return await this.authRepository.signUp(signUpCredentialsDto)
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<any> {
    const payload = await this.authRepository.signIn(signInCredentialsDto)
    if (payload) {
      const token = await this.jwtService.sign(payload.toJSON())
      return { token, user: payload }
    } else {
      throw new NotFoundException('Такой логин и/или пароль не существует!')
    }
  }

  getAllUsers(role: any) {
    if (role) {
      if (
        [UserRoles.ADMIN, UserRoles.DECLARANT, UserRoles.MANAGER].includes(role)
      ) {
        return this.authRepository.find({
          where: { role },
          relations: ['role'],
        })
      } else {
        throw new BadRequestException('Invalid user role')
      }
    } else {
      return this.authRepository.find({ relations: ['role'] })
    }
  }

  async getUserById(id: number) {
    const user = await this.authRepository.findOne({ id })
    if (!user) {
      throw new NotFoundException(`User with #${id} not found`)
    }
    return user
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.authRepository.updateUser(id, updateUserDto)
  }

  async deleteUser(id: number) {
    const user = await this.authRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(`User with #${id} not found`)
    }
    return this.authRepository.remove(user)
  }
}
