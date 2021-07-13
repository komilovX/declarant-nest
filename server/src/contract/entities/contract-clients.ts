import { Client } from 'src/database/entities/client.entity'
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContractDocuments } from './contract-documents.entity'
import { ContractShippers } from './contract-shippers.entity'

@Entity()
export class ContractClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @JoinColumn()
  @ManyToOne(() => Client, (client) => client.contracts, { eager: true })
  client: Client

  @JoinColumn()
  @ManyToOne(() => ContractDocuments, (document) => document.clients, {
    onDelete: 'CASCADE',
  })
  document: ContractDocuments

  @JoinColumn()
  @OneToMany(() => ContractShippers, (shipper) => shipper.client, {
    cascade: ['insert', 'update'],
    onUpdate: 'CASCADE',
  })
  shippers: ContractShippers[]
}
