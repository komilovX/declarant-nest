import { Shipper } from 'src/database/entities/shipper.entity'
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContractClient } from './contract-clients'
import { ContractNumbers } from './contract-numbers.entity'

@Entity()
export class ContractShippers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @JoinColumn()
  @ManyToOne(
    () => ContractClient,
    (contractClient) => contractClient.shippers,
    {
      onDelete: 'CASCADE',
    },
  )
  client: ContractClient

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
