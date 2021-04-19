import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { DatabaseService } from 'src/database/database.service'
import { DocumentType } from 'src/document-type/document-type.entity'
import { DocumentPrice } from 'src/documents/document-price.entity'
import { Document } from 'src/documents/document.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { DocumentTypes } from 'src/utils/lib/types'
import { notificationUtils } from 'src/utils/notification.util'
import { Connection, Repository } from 'typeorm'
import { OrderPrice } from './entities/order-price.entity'
import { Order } from './entities/order.entity'
import {
  CreateIncomingDocument,
  CreateOrderDto,
  FindOrderGridDto,
  OrderPriceDto,
  UpdateOrderDefaultItems,
  UpdateOrderDto,
} from './order.dto'
import { OrdersRepository } from './orders.repository'

const { orderGivenToYou } = notificationUtils

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
    @InjectRepository(DocumentPrice)
    private documentPriceRepository: Repository<DocumentPrice>,
    private databaseService: DatabaseService,
    private notificationService: NotificationsService,
    private connection: Connection,
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
      clientDirectorId,
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

    const clientDirector = await this.databaseService.clientDirectorRepository.findOne(
      clientDirectorId,
    )
    if (!clientDirector) {
      throw new NotFoundException(
        `Client Director with id #${clientDirector} not found`,
      )
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
      clientDirector,
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

    this.notificationService.createNotification(
      orderGivenToYou(user.name, order.id),
      [user.id, +declarantId],
    )
    return this.orderRepository.save(order)
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const {
      declarantId,
      shipperId,
      clientId,
      productId,
      clientDirectorId,
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

    const clientDirector = await this.databaseService.clientDirectorRepository.findOne(
      clientDirectorId,
    )
    if (!clientDirector) {
      throw new NotFoundException(
        `Client Director with id #${clientDirector} not found`,
      )
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
      clientDirector,
      product,
      declarant,
      ...otherData,
    })

    return this.orderRepository.save(newOrder)
  }

  async updateSecondaryItems(
    id: number,
    updateOrderDefaultItems: UpdateOrderDefaultItems,
  ) {
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDefaultItems,
    })
    if (!order) {
      throw new NotFoundException(`Order with id #${id} is not found`)
    }
    return this.orderRepository.save(order)
  }

  async updateOrderPrice(id: number, orderPriceDto: OrderPriceDto) {
    const order = await this.orderRepository.preload({ id })
    if (!order) {
      throw new NotFoundException(`Order with id ${id} is not found`)
    }

    const orderPrice = await this.orderPriceRepository.preload(orderPriceDto)
    if (!orderPrice) {
      throw new NotFoundException(
        `Order with id ${orderPriceDto.id} is not found`,
      )
    }

    order.orderPrice = orderPrice
    return this.orderRepository.save(order)
  }

  async findOrderByIdWithDetails(id: number, declarant: any) {
    let order: Order
    if (declarant) {
      order = await this.connection
        .createQueryBuilder()
        .select('order')
        .from(Order, 'order')
        .leftJoinAndSelect('order.documents', 'documents')
        .leftJoinAndSelect('order.shipper', 'shipper')
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.declarant', 'declarant')
        .leftJoinAndSelect('order.product', 'product')
        .leftJoinAndSelect('documents.declarant', 'manager')
        .leftJoinAndSelect('documents.documentType', 'documentType')
        .leftJoinAndSelect('documents.creator', 'creator')
        .where('order.id = :id', { id })
        .getOne()
    } else {
      order = await this.orderRepository.findOne(id, {
        relations: ['documents', 'orderPrice'],
      })
    }

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

  findOrderByUserDocument(id: number, user: User) {
    return this.orderRepository.findOrderByUserDocument(id, user)
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
        const documentFiles = !files
          ? []
          : files
              .filter((file) => {
                return (
                  `${documentType.number}` ===
                  file.originalname.slice(0, file.originalname.indexOf('-'))
                )
              })
              .map((f) => f.filename)

        const newDocument = this.documentRepository.create({
          files: documentFiles,
          number: document.number,
          type: DocumentTypes.INCOMING,
          documentType,
        })

        if (document.price) {
          newDocument.price = [
            this.documentPriceRepository.create({
              price: document.price,
              currency: document.currency,
            }),
          ]
        }

        return newDocument
      }),
    )
  }
}
