import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  value: string

  @Column({ default: true })
  read: boolean

  @Column({ default: false })
  create: boolean

  @Column({ default: false })
  delete: boolean

  @Column({ default: false })
  update: boolean

  @ManyToOne(() => Role, (role) => role.pages)
  roles: Role
}
