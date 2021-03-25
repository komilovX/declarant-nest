import { DocumentType } from 'src/document-type/document-type.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => DocumentType, (documentType) => documentType.departments)
  documentTypes: DocumentType[]
}
