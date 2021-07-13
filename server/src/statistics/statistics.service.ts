import { Injectable } from '@nestjs/common'
import { User } from 'src/auth/user.entity'
import { Document } from 'src/documents/document.entity'
import { Order } from 'src/orders/entities/order.entity'
import { getRepository } from 'typeorm'

@Injectable()
export class StatisticsService {
  async findTasksAndOrdersCount(user: User) {
    let orders = null
    const tasks = await getRepository(Document)
      .createQueryBuilder('document')
      .innerJoin('document.declarant', 'declarant', 'declarant.id = :id', {
        id: user.id,
      })
      .select('document.status', 'status')
      .addSelect('COUNT(status)', 'count')
      .groupBy('status')
      .getRawMany()

    if (user.role && user.role.pages) {
      const needOrder = user.role.pages.find((p) => p.value === 'orders')
      if (needOrder) {
        orders = await getRepository(Order)
          .createQueryBuilder('order')
          .select(
            'COUNT(case order.deleted when true then 1 else null end)',
            'deleted',
          )
          .addSelect(
            'COUNT(case order.archived when true then 1 else null end)',
            'archived',
          )
          .addSelect(
            'COUNT(case when order.archived = true then null when order.deleted = true then null else 1 end)',
            'active',
          )
          .where('order.declarantId = :id', { id: user.id })
          .getRawOne()
      }
    }
    return { tasks, orders }
  }
}
