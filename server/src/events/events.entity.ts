import { User } from 'src/auth/user.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Events extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  allDay: boolean

  @Column()
  start: Date

  @Column()
  end: Date

  @Column({ nullable: true })
  backgroundColor: string

  @Column({ nullable: true })
  borderColor: string

  @ManyToOne(() => User, (user) => user.events)
  user: User

  @Column()
  userId: number
}
