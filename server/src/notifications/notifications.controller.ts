import { Controller, Get, Param, Put } from '@nestjs/common'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('/')
  findAllNotifications(@GetUser() user: User) {
    return this.notificationsService.findAllNotifications(user)
  }

  @Put('/:id')
  changeToRead(@Param('id') id: number, @GetUser() user: User) {
    return this.notificationsService.changeToRead(id, user)
  }
}
