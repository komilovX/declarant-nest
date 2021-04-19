import { User } from 'src/auth/user.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Notifications } from './notifications.entity'

@Entity()
export class UserNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isRead: boolean

  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.userNotifications)
  user: User

  @Column()
  notificationId: number

  @ManyToOne(
    () => Notifications,
    (notifications) => notifications.userNotifications,
  )
  notification: Notifications
}
