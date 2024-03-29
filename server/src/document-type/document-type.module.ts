import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Department } from 'src/database/entities/department.entity'
import { DocumentTypeController } from './document-type.controller'
import { DocumentType } from './document-type.entity'
import { DocumentTypeService } from './document-type.service'

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType, Department])],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
})
export class DocumentTypeModule {}
