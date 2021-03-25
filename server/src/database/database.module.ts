import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseController } from './database.controller'
import { DatabaseService } from './database.service'
import { Client } from './entities/client.entity'
import { Department } from './entities/department.entity'
import { Product } from './entities/product.entity'
import { Shipper } from './entities/shipper.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Client, Shipper, Product, Department])],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
