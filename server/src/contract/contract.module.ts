import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'src/database/entities/client.entity'
import { Shipper } from 'src/database/entities/shipper.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import { ContractController } from './contract.controller'
import { ContractService } from './contract.service'
import { ContractFiles } from './entities/contract-files.entity'
import { ContractNumbers } from './entities/contract-numbers.entity'
import { Contract } from './entities/contract.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      ContractFiles,
      ContractNumbers,
      Client,
      Shipper,
      DocumentType,
    ]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
