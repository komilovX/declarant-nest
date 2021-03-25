import { EntityRepository, getRepository, Repository } from 'typeorm'
import { Document } from './document.entity'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { NotFoundException } from '@nestjs/common'
import { Order } from 'src/orders/entities/order.entity'
import { DocumentType } from '../document-type/document-type.entity'
import { User } from 'src/auth/user.entity'

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  private orderRepository = getRepository(Order)
  private userRepository = getRepository(User)
  private documentTypeRepository = getRepository(DocumentType)

  async cretateDocument(
    createDocumentDto: CreateDocumentDto,
    files: Express.Multer.File[],
    user: User,
  ): Promise<Document> {
    const {
      orderId,
      documentTypeId,
      type,
      declarantId,
      ...extraDto
    } = createDocumentDto
    let declarant = null
    const order = await this.orderRepository.findOne(orderId)
    const creator = await this.userRepository.findOne(user.id)
    const documentType = await this.documentTypeRepository.findOne(
      documentTypeId,
    )
    if (!order) {
      throw new NotFoundException(`Order with #${orderId} not found`)
    }
    if (!documentType) {
      throw new NotFoundException(
        `DocumentType with #${documentTypeId} not found`,
      )
    }

    const document = new Document()
    if (declarantId) {
      declarant = await this.userRepository.findOne(declarantId)
      if (!declarant) {
        throw new NotFoundException(
          `Declarant with #${documentTypeId} not found`,
        )
      }
      document.declarant = declarant
    }

    document.creator = creator
    document.order = order
    document.documentType = documentType
    document.type = type
    document.files = files && files.map((f) => f.filename)
    Object.entries(extraDto).forEach(([key, value]) => {
      document[key] = value
    })
    return this.save(document)
  }

  async updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.preload({
      id,
      ...updateDocumentDto,
    })
    if (!document) {
      throw new NotFoundException(`Document with #${id} not found`)
    }
    return this.save(document)
  }

  async deleteDocument(id: number): Promise<void> {
    const document = await this.findOne(id)

    if (!document) {
      throw new NotFoundException(`Document with #${id} not found`)
    }

    this.remove(document)
  }

  async addDocumentFile(id: number, file: Express.Multer.File) {
    const document = await this.preload({ id })

    if (!document) {
      throw new NotFoundException(`Document with #${id} not found`)
    }
    document.files = document.files
      ? document.files.concat([file.filename])
      : [file.filename]
    await this.save(document)
    return file.filename
  }

  async deleteDocumentFile(id: number, file: string) {
    const document = await this.preload({ id })

    if (!document) {
      throw new NotFoundException(`Document with #${id} not found`)
    }
    document.files = document.files.filter((f) => f !== file)
    return this.save(document)
  }
}
