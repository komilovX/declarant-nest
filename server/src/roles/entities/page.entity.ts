import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Role, (role) => role.pages)
  roles: Role[]
}
