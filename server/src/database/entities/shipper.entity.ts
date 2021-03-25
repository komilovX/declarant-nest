import { Contract } from 'src/contract/entities/contract.entity'
import { Order } from 'src/orders/entities/order.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Contract, (contract) => contract.shipper)
  contracts: Contract[]
}
