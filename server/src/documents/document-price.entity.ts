import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Document } from './document.entity'

@Entity()
export class DocumentPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Document, (document) => document.price, {
    onDelete: 'CASCADE',
  })
  document: Document

  @Column({ nullable: true })
  price: number

  @Column({ nullable: true })
  currency: string
}
