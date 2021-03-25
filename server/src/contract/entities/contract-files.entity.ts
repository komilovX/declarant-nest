import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContractNumbers } from './contract-numbers.entity'

@Entity()
export class ContractFiles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  date: Date

  @ManyToOne(() => ContractNumbers, (contractNumber) => contractNumber.files)
  contractNumber: ContractNumbers

  @Column()
  file: string
}
