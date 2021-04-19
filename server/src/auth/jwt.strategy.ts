import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Connection } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private connection: Connection) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    })
  }

  async validate(payload: any) {
    const { id } = payload
    const user = await this.connection
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.pages', 'pages')
      .where('user.id = :id', { id })
      .getOne()
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
