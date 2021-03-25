import { User } from 'src/auth/user.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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

  @JoinTable()
  @ManyToMany(() => Page, (page) => page.roles, {
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  pages: Page[]

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}
