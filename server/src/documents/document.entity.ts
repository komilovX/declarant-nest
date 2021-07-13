import { User } from 'src/auth/user.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import { DocumentStatus } from 'src/utils/lib/types'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '../orders/entities/order.entity'
import { DocumentPrice } from './document-price.entity'

@Entity()
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.documents)
  order: Order

  @Column({ nullable: true })
  declarantId: number

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.document, {
    eager: true,
    onDelete: 'CASCADE',
  })
  declarant: User

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.document, {
    eager: true,
    onDelete: 'CASCADE',
  })
  creator: User

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

  @Column({ default: new Date() })
  createdAt: Date

  @Column({ nullable: true })
  expire: Date

  @Column({ nullable: true })
  returnText: string

  @JoinColumn()
  @OneToMany(() => DocumentPrice, (documentPrice) => documentPrice.document, {
    cascade: true,
    eager: true,
  })
  price: DocumentPrice[]

  @Column({ default: DocumentStatus.NEW })
  status: string
}
