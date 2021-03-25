import { User } from 'src/auth/user.entity'
import { Client } from 'src/database/entities/client.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '../orders/entities/order.entity'

@Entity()
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.documents)
  order: Order

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.document)
  declarant: User

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.document, { eager: true })
  creator: User

  @JoinColumn()
  @ManyToOne(() => DocumentType, (documentType) => documentType.documents, {
    eager: true,
  })
  documentType: DocumentType

  @Column()
  type: string

  @Column('json', { nullable: true })
  files: string[]

  @Column({ nullable: true })
  comment: string

  @Column({ nullable: true })
  number: string

  @Column({ nullable: true })
  price: number

  @Column({ nullable: true })
  currency: string
}
