import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { DatabaseService } from 'src/database/database.service'
import { DocumentType } from 'src/document-type/document-type.entity'
import { Document } from 'src/documents/document.entity'
import { DocumentTypes } from 'src/utils/lib/types'
import { Repository } from 'typeorm'
import { OrderPrice } from './entities/order-price.entity'
import {
  CreateIncomingDocument,
  CreateOrderDto,
  FindOrderGridDto,
  UpdateOrderDto,
} from './order.dto'
import { OrdersRepository } from './orders.repository'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private orderRepository: OrdersRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DocumentType)
    private documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(OrderPrice)
    private orderPriceRepository: Repository<OrderPrice>,
    private databaseService: DatabaseService,
  ) {}

  findOrdersByGrid(
    findOrderGridDto: FindOrderGridDto,
    query: { deleted: boolean; archived: boolean },
  ) {
    return this.orderRepository.findOrdersByGrid(findOrderGridDto, query)
  }

  findOrdersByUser(findOrderGridDto: FindOrderGridDto, user: User) {
    return this.orderRepository.findOrdersByUserId(findOrderGridDto, user)
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    const {
      declarantId,
      shipperId,
      clientId,
      productId,
      documents: incomingDocuments,
      ...otherOrderDatas
    } = createOrderDto
    const shipper = await this.databaseService.shipperRepository.findOne(
      shipperId,
    )
    if (!shipper) {
      throw new NotFoundException(`Shipper with id #${shipperId} not found`)
    }

    const client = await this.databaseService.clientRepository.findOne(clientId)
    if (!client) {
      throw new NotFoundException(`client with id #${clientId} not found`)
    }

    const product = await this.databaseService.productRepository.findOne(
      productId,
    )
    if (!product) {
      throw new NotFoundException(`product with id #${productId} not found`)
    }

    const declarant = await this.userRepository.findOne(declarantId)
    if (!declarant) {
      throw new NotFoundException(`declarant with id #${declarantId} not found`)
    }

    const order = this.orderRepository.create({
      user,
      declarant,
      client,
      product,
      shipper,
      orderPrice: this.orderPriceRepository.create(),
      ...otherOrderDatas,
    })

    const documents = JSON.parse(incomingDocuments) as CreateIncomingDocument[]
    let preloadedDocuments = await this.preloadDocuments(documents, files)
    preloadedDocuments = preloadedDocuments.map((document) => {
      document.creator = user
      return document
    })
    order.documents = preloadedDocuments

    return this.orderRepository.save(order)
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const {
      declarantId,
      shipperId,
      clientId,
      productId,
      ...otherData
    } = updateOrderDto
    const order = await this.orderRepository.findOne(id)

    if (!order) {
      throw new NotFoundException(`Order with id #${id} is not found`)
    }

    const shipper = await this.databaseService.shipperRepository.findOne(
      shipperId,
    )
    if (!shipper) {
      throw new NotFoundException(`Shipper with id #${shipperId} not found`)
    }

    const client = await this.databaseService.clientRepository.findOne(clientId)
    if (!client) {
      throw new NotFoundException(`client with id #${clientId} not found`)
    }

    const product = await this.databaseService.productRepository.findOne(
      productId,
    )

    if (!product) {
      throw new NotFoundException(`product with id #${productId} not found`)
    }

    const declarant = await this.userRepository.findOne(declarantId)
    if (!declarant) {
      throw new NotFoundException(`declarant with id #${declarantId} not found`)
    }

    const newOrder = await this.orderRepository.preload({
      id,
      shipper,
      client,
      product,
      declarant,
      ...otherData,
    })

    return this.orderRepository.save(newOrder)
  }

  async findOrderByIdWithDetails(id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['documents', 'orderPrice'],
    })

    if (!order) {
      throw new NotFoundException(`Order with id=${id} is not found`)
    }

    return order
  }

  async findOrderById(id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['documents'],
    })

    if (!order) {
      throw new NotFoundException(`Order with id=${id} is not found`)
    }
    const { documents, ...orderDetails } = order
    const incomingDocuments = documents.filter(
      (doc) => doc.type === DocumentTypes.INCOMING,
    )
    return { documents: incomingDocuments, order: orderDetails }
  }

  private async preloadDocuments(
    documents: CreateIncomingDocument[],
    files: Express.Multer.File[],
  ) {
    return await Promise.all(
      documents.map(async (document) => {
        const documentType = await this.documentTypeRepository.findOne(
          document.documentTypeId,
        )
        if (!documentType) {
          throw new NotFoundException(
            `DocumentType with id #${document.documentTypeId} not found`,
          )
        }
        const documentFiles = files
          .filter((file) => {
            return (
              `${documentType.number}` ===
              file.originalname.slice(0, file.originalname.indexOf('-'))
            )
          })
          .map((f) => f.filename)

        return this.documentRepository.create({
          files: documentFiles,
          price: document.price,
          currency: document.currency,
          number: document.number,
          type: DocumentTypes.INCOMING,
          documentType,
        })
      }),
    )
  }
}
