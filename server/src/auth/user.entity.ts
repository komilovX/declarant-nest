import { classToPlain, Exclude } from 'class-transformer'
import { Events } from 'src/events/events.entity'
import { UserNotification } from 'src/notifications/entities/user-notification.entity'
import { Order } from 'src/orders/entities/order.entity'
import { Role } from 'src/roles/entities/role.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Document } from '../documents/document.entity'

@Entity()
@Unique(['login', 'name'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  login: string

  @Column()
  username: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Column()
  @Exclude({ toPlainOnly: true })
  salt: string

  @JoinColumn()
  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  role: Role

  @OneToMany(() => Document, (document) => document.creator)
  document: Document[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]

  @OneToMany(() => Events, (events) => events.user)
  events: Events[]

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.user,
  )
  userNotifications: UserNotification[]

  toJSON() {
    return classToPlain(this)
  }
}
