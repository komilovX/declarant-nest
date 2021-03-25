import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: true,
  }
}
