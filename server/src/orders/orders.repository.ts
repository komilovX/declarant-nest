import { User } from 'src/auth/user.entity'
import { EntityRepository, Like, Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { FindOrderGridDto } from './order.dto'

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  async findOrdersByGrid(
    findOrderGridDto: FindOrderGridDto,
    query: { deleted: boolean; archived: boolean },
  ) {
    const { filter, sort, limit, page = 1 } = findOrderGridDto
    const { deleted, archived } = query

    const filterColumns = {}
    Object.keys(filter).forEach((key) => {
      filterColumns[key] = Like(`%${filter[key]}%`)
    })
    let conditions

    if (deleted || archived) {
      conditions = [
        { archived: true, ...filterColumns },
        { deleted: true, ...filterColumns },
      ]
    } else {
      conditions = { deleted: false, archived: false, ...filterColumns }
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
      filterColumns[key] = Like(`%${filter[key]}%`)
    })

    const conditions = { declarantId: user.id, ...filterColumns }

    return this.findAndCount({
      where: conditions,
      order: sort,
      skip: (page - 1) * limit,
      take: limit,
    })
  }
}
