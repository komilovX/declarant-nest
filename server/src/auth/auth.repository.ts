import * as bcrypt from 'bcrypt'
import { Connection, getCustomRepository, getRepository } from 'typeorm'
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
import { Department } from 'src/database/entities/department.entity'

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  constructor(private connection: Connection) {
    super()
  }
  private roleRepository = getCustomRepository(RoleRepository)

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const {
      name,
      role,
      login,
      password,
      username,
      departments: departmentsArray,
    } = signUpCredentialsDto
    const userRole = await this.roleRepository.findOne({ role })
    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`)
    }
    const departments = await Promise.all(
      departmentsArray.map((dep) => getRepository(Department).findOne(dep)),
    )
    const user = new User()
    user.name = name
    user.role = userRole
    user.login = login
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(password, user.salt)
    user.departments = departments
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
    const user = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.pages', 'pages')
      .where('user.login = :login', { login })
      .getOne()

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
    const {
      role,
      password,
      departments: departmentsArray,
      ...otherData
    } = updateUserDto
    const userRole = await this.roleRepository.findOne({
      role,
    })
    if (!userRole) {
      throw new NotFoundException(`Role ${role} not found`)
    }
    const departments = await Promise.all(
      departmentsArray.map((dep) => getRepository(Department).findOne(dep)),
    )
    const user = await this.preload({
      id,
      role: userRole,
      departments,
      ...otherData,
    })
    if (!user) {
      throw new NotFoundException(`User with #${id} not found`)
    }
    if (password) {
      user.salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(password, user.salt)
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
