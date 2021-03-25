import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Page } from './entities/page.entity'
import { RoleRepository } from './role.repository'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository, Page])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
