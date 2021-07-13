import { ContractClient } from 'src/contract/entities/contract-clients'
import { Order } from 'src/orders/entities/order.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ClientDirectors } from './client-directors.entity'

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

  @ManyToOne(() => ContractClient, (contractClient) => contractClient.client)
  contracts: ContractClient[]

  @JoinColumn()
  @OneToMany(
    () => ClientDirectors,
    (clientDirectors) => clientDirectors.client,
    { cascade: true, eager: true },
  )
  directors: ClientDirectors[]
}
