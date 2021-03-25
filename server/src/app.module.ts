import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { configOptions } from './config/environment.config'
// import { typeOrmConfig } from './config/typeorm.config'
import { OrdersModule } from './orders/orders.module'
import { DocumentsModule } from './documents/documents.module'
import { DatabaseModule } from './database/database.module'
import { RolesModule } from './roles/roles.module'
import { DocumentTypeModule } from './document-type/document-type.module'
import { ContractModule } from './contract/contract.module'
import { MulterModule } from '@nestjs/platform-express'
import { imageFileFilter } from './utils/file-uploading.utils'
import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MulterModule.register({
      dest: './uploads',
      fileFilter: imageFileFilter,
    }),
    AuthModule,
    CommonModule,
    OrdersModule,
    DocumentsModule,
    DatabaseModule,
    RolesModule,
    DocumentTypeModule,
    ContractModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
