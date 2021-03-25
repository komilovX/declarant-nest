import { Contract } from 'src/contract/entities/contract.entity'
import { Document } from 'src/documents/document.entity'
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
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  date: Date

  @Column()
  name: string

  @Column()
  info: string

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[]

  @ManyToOne(() => Contract, (contract) => contract.client)
  contracts: Contract[]
}
