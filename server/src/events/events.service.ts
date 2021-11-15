import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { CreateEventDto, UpdateEventDto } from './event.dto'
import { Events } from './events.entity'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {}

  async create(dto: CreateEventDto, userId: number) {
    const user = await User.findOne(userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const event = new Events()
    event.title = dto.title
    event.start = dto.start
    event.end = dto.end
    event.allDay = dto.allDay
    event.user = user
    event.backgroundColor = dto.backgroundColor ? dto.backgroundColor : null
    event.borderColor = dto.backgroundColor ? dto.backgroundColor : null
    const savedEvent = await this.eventsRepository.save(event)
    delete savedEvent.user
    return savedEvent
  }

  async find(user: User, dateStr: string) {
    const date = dateStr ? new Date(dateStr) : new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    const events = await this.eventsRepository.find({
      where: {
        start: MoreThanOrEqual(firstDay),
        end: LessThanOrEqual(lastDay),
        userId: user.id,
      },
    })
    return events
  }

  async update(dto: UpdateEventDto, id: number) {
    const event = await this.eventsRepository.preload({
      id,
      ...dto,
    })
    if (!event) {
      throw new NotFoundException('Event Not Found')
    }
    return this.eventsRepository.save(event)
  }

  delete(id: number, user: User) {
    return this.eventsRepository
      .findOneOrFail({
        where: {
          id,
          userId: user.id,
        },
      })
      .then((event) => event.remove())
  }
}
