import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContractFiles } from './contract-files.entity'
import { ContractShippers } from './contract-shippers.entity'

@Entity()
export class ContractNumbers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  number: string

  @JoinColumn()
  @ManyToOne(
    () => ContractShippers,
    (contractShippers) => contractShippers.numbers,
    { onDelete: 'CASCADE' },
  )
  contract: ContractShippers

  @JoinColumn()
  @OneToMany(
    () => ContractFiles,
    (contractFiles) => contractFiles.contractNumber,
    {
      cascade: true,
      eager: true,
    },
  )
  files: ContractFiles[]
}
