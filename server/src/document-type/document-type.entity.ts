import { ContractDocuments } from 'src/contract/entities/contract-documents.entity'
import { Department } from 'src/database/entities/department.entity'
import { Document } from 'src/documents/document.entity'

import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class DocumentType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number: string

  @Column()
  info: string

  @Column('json')
  types: string[]

  @JoinTable()
  @ManyToMany(() => Department, (department) => department.documentTypes, {
    cascade: true,
  })
  departments: Department[]

  @OneToMany(() => ContractDocuments, (contract) => contract.documentType)
  contracts: ContractDocuments[]

  @OneToMany(() => Document, (document) => document.documentType)
  documents: Document[]
}
