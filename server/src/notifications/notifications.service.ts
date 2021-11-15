import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { getRepository, Repository } from 'typeorm'
import { Notifications } from './entities/notifications.entity'
import { UserNotification } from './entities/user-notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
  ) {}

  findAllNotifications(user: User) {
    return getRepository(Notifications)
      .createQueryBuilder('notifications')
      .innerJoin('notifications.userNotifications', 'userNotifications')
      .innerJoin(
        'userNotifications.user',
        'user',
        'user.id = :userId AND userNotifications.isRead = false',
        {
          userId: user.id,
        },
      )
      .orderBy('notifications.date', 'DESC')
      .getMany()
  }

  async createNotification(message: string, userIds: number[]) {
    const userNotifications = await Promise.all(
      userIds.map((id: number) => {
        return this.userNotificationRepository.create({ userId: id })
      }),
    )
    const notification = this.notificationsRepository.create({
      message,
      userNotifications,
    })
    return this.notificationsRepository.save(notification)
  }

  async changeToRead(id: number, user: User) {
    const notification = await this.userNotificationRepository.findOne({
      userId: user.id,
      notificationId: id,
    })
    if (!notification) {
      throw new NotFoundException(`Notification not found`)
    }
    notification.isRead = true
    return this.userNotificationRepository.save(notification)
  }
}
