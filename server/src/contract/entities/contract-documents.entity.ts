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
import { ContractClient } from './contract-clients'

@Entity()
export class ContractDocuments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  documentTypeId: number

  @JoinColumn()
  @ManyToOne(() => DocumentType, (documentType) => documentType.contracts, {
    eager: true,
  })
  documentType: DocumentType

  @JoinColumn()
  @OneToMany(() => ContractClient, (client) => client.document)
  clients: DocumentType[]
}
