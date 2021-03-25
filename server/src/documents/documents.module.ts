import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from 'src/orders/entities/order.entity'
import { DocumentRepository } from './document.repository'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'

@Module({
  imports: [TypeOrmModule.forFeature([DocumentRepository, Order])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
