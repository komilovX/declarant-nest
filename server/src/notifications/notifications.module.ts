import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notifications } from './entities/notifications.entity'
import { UserNotification } from './entities/user-notification.entity'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notifications, UserNotification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
