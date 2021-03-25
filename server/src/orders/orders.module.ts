import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { DatabaseModule } from 'src/database/database.module'
import { DocumentType } from 'src/document-type/document-type.entity'
import { Document } from 'src/documents/document.entity'
import { DocumentsModule } from 'src/documents/documents.module'
import { OrderPrice } from './entities/order-price.entity'
import { Order } from './entities/order.entity'
import { OrdersController } from './orders.controller'
import { OrdersRepository } from './orders.repository'
import { OrdersService } from './orders.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersRepository,
      Order,
      OrderPrice,
      User,
      DocumentType,
      Document,
    ]),
    DocumentsModule,
    DatabaseModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
