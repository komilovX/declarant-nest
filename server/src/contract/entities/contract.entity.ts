import { Client } from 'src/database/entities/client.entity'
import { Shipper } from 'src/database/entities/shipper.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContractNumbers } from './contract-numbers.entity'

@Entity()
export class Contract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  documentTypeId: number

  @JoinColumn()
  @ManyToOne(() => DocumentType, (documentType) => documentType)
  documentType: DocumentType

  @JoinColumn()
  @ManyToOne(() => Client, (client) => client.contracts)
  client: Client

  @JoinColumn()
  @ManyToOne(() => Shipper, (shipper) => shipper.contracts)
  shipper: Shipper

  @JoinColumn()
  @OneToMany(
    () => ContractNumbers,
    (contractNumber) => contractNumber.contract,
    {
      cascade: true,
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  numbers: ContractNumbers[]
}
