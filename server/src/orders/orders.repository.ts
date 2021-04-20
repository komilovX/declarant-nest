import { User } from 'src/auth/user.entity'
import { Connection, EntityRepository, Like, Raw, Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { FindOrderGridDto } from './order.dto'

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  constructor(private connection: Connection) {
    super()
  }

  async findOrdersByGrid(
    findOrderGridDto: FindOrderGridDto,
    query: { deleted: boolean; archived: boolean },
  ) {
    const { filter, sort, limit, page = 1 } = findOrderGridDto
    const { deleted, archived } = query
    const filterColumns = {}
    Object.keys(filter).forEach((key) => {
      switch (key) {
        case 'user':
          filterColumns['user'] = { id: filter[key] }
          return
        case 'client':
          filterColumns['client'] = { id: filter[key] }
          return
        case 'shipper':
          filterColumns['shipper'] = { id: filter[key] }
          return
        default:
          filterColumns[key] = Raw(
            (alias) => `CAST(${alias} AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          break
      }
      //   filterColumns[key] = Like(`%${filter[key]}%`)
    })
    let conditions

    if (deleted || archived) {
      conditions = [
        { archived: true, ...filterColumns },
        { deleted: true, ...filterColumns },
      ]
    } else {
      conditions = {
        deleted: false,
        archived: false,
        ...filterColumns,
      }
    }
    return this.findAndCount({
      where: conditions,
      order: sort,
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async findOrdersByUserId(findOrderGridDto: FindOrderGridDto, user: User) {
    const { filter, sort, limit, page = 1 } = findOrderGridDto

    const filterColumns = {}
    Object.keys(filter).forEach((key) => {
      switch (key) {
        case 'user':
          filterColumns['user'] = { id: filter[key] }
          return
        case 'declarant':
          filterColumns['declarant'] = { id: filter[key] }
          return
        case 'client':
          filterColumns['client'] = { id: filter[key] }
          return
        case 'shipper':
          filterColumns['shipper'] = { id: filter[key] }
          return
        case 'product':
          filterColumns['product'] = { id: filter[key] }
          return
        default:
          filterColumns[key] = Raw(
            (alias) => `CAST(${alias} AS VARCHAR(30)) LIKE '%${filter[key]}%'`,
          )
          break
      }
      //   filterColumns[key] = Like(`%${filter[key]}%`)
    })

    const conditions = {
      declarantId: user.id,
      archived: false,
      ...filterColumns,
    }

    return this.findAndCount({
      where: conditions,
      order: sort,
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async findOrderByUserDocument(id: number, user: User) {
    return this.connection
      .createQueryBuilder()
      .select('order')
      .from(Order, 'order')
      .leftJoinAndSelect('order.documents', 'documents')
      .leftJoinAndSelect('order.shipper', 'shipper')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.declarant', 'declarant')
      .leftJoinAndSelect('documents.declarant', 'manager')
      .leftJoinAndSelect('documents.documentType', 'documentType')
      .leftJoinAndSelect('documents.creator', 'creator')
      .leftJoinAndSelect('documents.price', 'price')
      .where('order.id = :id AND (manager.id = :userId OR manager IS NULL)', {
        id,
        userId: user.id,
      })
      .getOne()
  }
}
