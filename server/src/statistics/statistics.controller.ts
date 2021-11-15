import { Controller, Get, Query } from '@nestjs/common'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { StatisticsService } from './statistics.service'

@Controller('statisitcs')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('/')
  findTasksAndOrdersCount(@GetUser() user: User) {
    return this.statisticsService.findTasksAndOrdersCount(user)
  }

  @Get('/calendar')
  findForCalendar(@GetUser() user: User, @Query('date') date: string) {
    return this.statisticsService.findTasksForCalendar(user, date)
  }
}
