import { ContractShippers } from 'src/contract/entities/contract-shippers.entity'
import { Order } from 'src/orders/entities/order.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Shipper extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => Order, (order) => order.shipper)
  orders: Order[]

  @OneToMany(
    () => ContractShippers,
    (contractShippers) => contractShippers.shipper,
  )
  contracts: ContractShippers[]
}
