import {
  EntityRepository,
  getRepository,
  In,
  Like,
  Raw,
  Repository,
} from 'typeorm'
import { Document } from './document.entity'
import {
  CreateDocumentDto,
  DocumentPriceI,
  GiveTaskDocumentDto,
} from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { NotAcceptableException, NotFoundException } from '@nestjs/common'
import { Order } from 'src/orders/entities/order.entity'
import { DocumentType } from '../document-type/document-type.entity'
import { User } from 'src/auth/user.entity'
import { DocumentPrice } from './document-price.entity'
import { DocumentStatus } from 'src/utils/lib/types'
import { FindOrderGridDto } from 'src/orders/order.dto'

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
  private orderRepository = getRepository(Order)
  private userRepository = getRepository(User)
  private documentTypeRepository = getRepository(DocumentType)
  private documentPriceRepository = getRepository(DocumentPrice)

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
      price,
      currency,
      ...extraDto
    } = createDocumentDto

    let declarant = null
    const order = await this.orderRepository.findOne(orderId)
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

    if (price) {
      const newPrice = this.documentPriceRepository.create({
        price,
        currency,
      })
      document.price = [newPrice]
    }
    document.creator = user
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
    const { price, ...otherData } = updateDocumentDto
    const document = await this.preload({
      id,
      ...otherData,
    })
    if (!document) {
      throw new NotFoundException(`Document with #${id} not found`)
    }
    if (price) {
      const preloadedPrices = await Promise.all(
        price.map((p) => this.preloadPrices(p)),
      )
      document.price = preloadedPrices
    }
    return this.save(document)
  }

  async findDocumentsByUserId(
    user: User,
    findOrderGridDto: FindOrderGridDto,
    status: string | string[],
  ) {
    const { filter, sort, limit, page = 1 } = findOrderGridDto

    const filterColumns = {}
    const filterArrays = []
    Object.keys(filter).forEach((key) => {
      switch (key) {
        case 'documentType.number':
          filterColumns['documentType'] = { id: filter[key] }
          return
        case 'documentType.name':
          filterColumns['documentType'] = { id: filter[key] }
          return
        case 'creator':
          filterColumns['creator'] = { id: filter[key] }
          return
        case 'order.client':
          filterArrays.push(
            `CAST(client.id AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          return
        case 'order.post_number':
          filterArrays.push(`order.post_number LIKE '%${filter[key]}%'`)
          return
        case 'order':
          filterArrays.push(
            `CAST(order.id AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          return
        case 'order.container':
          filterArrays.push(`order.container LIKE '%${filter[key]}%'`)
          return
        case 'order.shipper':
          filterArrays.push(
            `CAST(shipper.id AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          return
        case 'order.product':
          filterArrays.push(
            `CAST(product.id AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          return
        default:
          filterColumns[key] = Raw(
            (alias) => `CAST(${alias} AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          break
      }
    })
    let conditions

    if (status) {
      conditions = {
        status: typeof status === 'string' ? status : In(status),
        declarantId: user.id,
        ...filterColumns,
      }
    } else {
      conditions = { declarantId: user.id, ...filterColumns }
    }

    return this.findAndCount({
      join: {
        alias: 'document',
        innerJoinAndSelect: {
          order: 'document.order',
          client: 'order.client',
          shipper: 'order.shipper',
          product: 'order.product',
          documentType: 'document.documentType',
          creator: 'document.creator',
        },
      },
      where: (qb) => {
        filterArrays.length
          ? qb.where(conditions).andWhere(filterArrays.join(' AND '))
          : qb.where(conditions)
      },
      order: sort,
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async giveTask(
    giveTaskDocumentDto: GiveTaskDocumentDto,
    user: User,
  ): Promise<Document> {
    const {
      orderId,
      documentTypeId,
      declarantId,
      type,
      expire,
    } = giveTaskDocumentDto

    const order = await this.orderRepository.findOne(orderId)
    const declarant = await this.userRepository.findOne(declarantId)
    const documentType = await this.documentTypeRepository.findOne(
      documentTypeId,
    )

    if (!order) {
      throw new NotFoundException(`Order with #${orderId} not found`)
    }
    if (!declarant) {
      throw new NotFoundException(`Declarant with #${declarantId} not found`)
    }
    if (!documentType) {
      throw new NotFoundException(
        `DocumentType with #${documentTypeId} not found`,
      )
    }

    const document = new Document()
    document.order = order
    document.creator = user
    document.declarant = declarant
    document.documentType = documentType
    document.type = type
    document.expire = expire
    document.status = DocumentStatus.TASK
    return this.save(document)
  }

  async updateTask(
    id: number,
    giveTaskDocumentDto: GiveTaskDocumentDto,
    user: User,
  ) {
    const document = await this.preload({
      id,
    })
    if (!document) {
      throw new NotFoundException('Document not found')
    }
    const {
      orderId,
      documentTypeId,
      declarantId,
      type,
      expire,
    } = giveTaskDocumentDto

    const order = await this.orderRepository.findOne(orderId)
    const declarant = await this.userRepository.findOne(declarantId)
    const documentType = await this.documentTypeRepository.findOne(
      documentTypeId,
    )

    if (!order) {
      throw new NotFoundException(`Order with #${orderId} not found`)
    }
    if (!declarant) {
      throw new NotFoundException(`Declarant with #${declarantId} not found`)
    }
    if (!documentType) {
      throw new NotFoundException(
        `DocumentType with #${documentTypeId} not found`,
      )
    }
    if (order.declarant.id !== user.id) {
      throw new NotAcceptableException('Access denied')
    }

    document.order = order
    document.creator = user
    document.declarant = declarant
    document.documentType = documentType
    document.type = type
    document.expire = expire
    document.status = DocumentStatus.TASK
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

  private async preloadPrices(price: DocumentPriceI) {
    if (price.id) {
      return this.documentPriceRepository.preload(price)
    }
    return this.documentPriceRepository.create(price)
  }
}
