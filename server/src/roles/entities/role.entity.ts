import { User } from 'src/auth/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Page } from './page.entity'

@Entity()
@Unique(['role'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  role: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @JoinColumn()
  @OneToMany(() => Page, (page) => page.roles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pages: Page[]

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}
