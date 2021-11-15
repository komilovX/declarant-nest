import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsController } from './events.controller'
import { Events } from './events.entity'
import { EventsService } from './events.service'

@Module({
  imports: [TypeOrmModule.forFeature([Events])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
