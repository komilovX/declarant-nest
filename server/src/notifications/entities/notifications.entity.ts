import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserNotification } from './user-notification.entity'

@Entity()
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: new Date() })
  date: Date

  @Column()
  message: string

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.notification,
    { cascade: true },
  )
  userNotifications: UserNotification[]
}
