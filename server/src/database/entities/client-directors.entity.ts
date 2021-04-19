import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Client } from 'src/database/entities/client.entity'
import { Order } from 'src/orders/entities/order.entity'
@Entity()
export class ClientDirectors extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Client, (client) => client.directors, {
    onDelete: 'CASCADE',
  })
  client: Client

  @OneToMany(() => Order, (order) => order.clientDirector, {
    onDelete: 'CASCADE',
  })
  orders: Order[]
}
