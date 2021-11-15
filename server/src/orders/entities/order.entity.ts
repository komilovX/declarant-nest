import { User } from 'src/auth/user.entity'
import { Client } from 'src/database/entities/client.entity'
import { Product } from 'src/database/entities/product.entity'
import { Shipper } from 'src/database/entities/shipper.entity'
import { Document } from 'src/documents/document.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OrderPrice } from './order-price.entity'
import { OrderStatus } from 'src/utils/lib/types'
import { ClientDirectors } from 'src/database/entities/client-directors.entity'

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  date: Date

  @Column()
  date_income: Date

  @Column()
  container: string

  @Column()
  post_number: string

  @Column({ nullable: true })
  post_date: Date

  @Column({ default: OrderStatus.NEW })
  status: string

  @Column({ default: false })
  archived: boolean

  @Column({ default: false })
  deleted: boolean

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User

  @Column()
  declarantId: number

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  declarant: User

  @JoinColumn()
  @OneToMany(() => Document, (document) => document.order, { cascade: true })
  documents: Document[]

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.orders, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  product: Product

  @JoinColumn()
  @ManyToOne(() => Client, (client) => client.orders, { eager: true })
  client: Client

  @JoinColumn()
  @ManyToOne(() => ClientDirectors, (clientDirector) => clientDirector.orders, {
    eager: true,
  })
  clientDirector: ClientDirectors

  @JoinColumn()
  @ManyToOne(() => Shipper, (shipper) => shipper.orders, { eager: true })
  shipper: Shipper

  @JoinColumn()
  @OneToOne(() => OrderPrice, (orderPrice) => orderPrice.order, {
    cascade: true,
  })
  orderPrice: OrderPrice
}
