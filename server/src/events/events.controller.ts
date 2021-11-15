import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { CreateEventDto, UpdateEventDto } from './event.dto'
import { EventsService } from './events.service'

@Controller('events')
export class EventsController {
  constructor(public eventsService: EventsService) {}

  @Post('/')
  create(@Body() dto: CreateEventDto, @GetUser() user: User) {
    return this.eventsService.create(dto, user.id)
  }

  @Get('/')
  find(@GetUser() user: User, @Query('date') date: string) {
    return this.eventsService.find(user, date)
  }

  @Delete('/:id')
  delete(@Param('id') id: number, @GetUser() user: User) {
    return this.eventsService.delete(id, user)
  }

  @Put('/:id')
  update(@Body() dto: UpdateEventDto, @Param('id') id: number) {
    return this.eventsService.update(dto, id)
  }
}
