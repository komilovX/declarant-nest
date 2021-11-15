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

  async findTasksForCalendar(user: User, dateStr: string) {
    const date = dateStr ? new Date(dateStr) : new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    const tasks = await getRepository(Document)
      .createQueryBuilder('document')
      .innerJoin('document.declarant', 'declarant', 'declarant.id = :id', {
        id: user.id,
      })
      .innerJoinAndSelect('document.documentType', 'documentType')
      .innerJoinAndSelect('document.order', 'order')
      .select('document.id', 'id')
      .addSelect('document.expire', 'expire')
      .addSelect('document.status', 'status')
      .addSelect('documentType.name', 'name')
      .addSelect('documentType.number', 'number')
      .addSelect('order.id', 'orderId')
      .where('document.type = :type', { type: 'declarant' })
      .andWhere(
        'document.expire >= :firstDay AND document.expire <= :lastDay',
        { firstDay, lastDay },
      )
      .getRawMany()

    return tasks
  }

  calculateOrdersBenefitAndCount() {}
}
