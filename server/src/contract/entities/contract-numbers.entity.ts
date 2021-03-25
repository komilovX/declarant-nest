import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Contract } from './contract.entity'
import { ContractFiles } from './contract-files.entity'

@Entity()
export class ContractNumbers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  number: string

  @ManyToOne(() => Contract, (contract) => contract.numbers)
  contract: Contract

  @JoinColumn()
  @OneToMany(
    () => ContractFiles,
    (contractFiles) => contractFiles.contractNumber,
    {
      cascade: true,
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  files: ContractFiles[]
}
