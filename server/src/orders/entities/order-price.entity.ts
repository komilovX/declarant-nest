import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class OrderPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  course: number

  @Column({ nullable: true })
  percent: number

  @Column({ nullable: true })
  comingSum: number

  @Column({ nullable: true })
  comingDollar: number

  @Column({ nullable: true })
  comingInvoice: number

  @OneToOne(() => Order, (order) => order.orderPrice)
  order: Order
}
