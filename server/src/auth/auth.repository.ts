import * as bcrypt from 'bcrypt'
import { getCustomRepository } from 'typeorm'
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto'
import { User } from './user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { RoleRepository } from 'src/roles/role.repository'

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  private roleRepository = getCustomRepository(RoleRepository)

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { name, role, login, password, username } = signUpCredentialsDto
    const userRole = await this.roleRepository.findOne({ role })
    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`)
    }

    const user = new User()
    user.name = name
    user.role = userRole
    user.login = login
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(password, user.salt)
    try {
      await user.save()
    } catch (e) {
      if (+e.code === 23505) {
        throw new ConflictException('user already exist')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<User> {
    const { login, password } = signInCredentialsDto
    const user = await this.findOne({ where: { login }, relations: ['role'] })

    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password)
      if (correctPassword) {
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { role, ...otherData } = updateUserDto
    const userRole = await this.roleRepository.findOne({
      role,
    })
    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`)
    }
    const user = await this.preload({
      id,
      role: userRole,
      ...otherData,
    })
    if (!user) {
      throw new NotFoundException(`User with #${id} not found`)
    }
    try {
      await user.save()
    } catch (e) {
      if (+e.code === 23505) {
        throw new ConflictException('user already exist')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
