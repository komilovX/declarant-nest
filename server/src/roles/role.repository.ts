import { NotFoundException } from '@nestjs/common'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto'
import { Page } from './entities/page.entity'
import { Role } from './entities/role.entity'

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  private pageRepository = getRepository(Page)

  async createRole(createRoleDto: CreateRoleDto) {
    console.log('createRoleDto', createRoleDto)
    const pages = await Promise.all(
      createRoleDto.pages.map((name) => this.preloadPage(name)),
    )

    const role = this.create({
      ...createRoleDto,
      pages,
    })
    return this.save(role)
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const pages =
      updateRoleDto.pages &&
      (await Promise.all(
        updateRoleDto.pages.map((name) => this.preloadPage(name)),
      ))
    const role = await this.preload({
      id,
      ...updateRoleDto,
      pages,
    })
    role.pages = pages

    if (!role) {
      throw new NotFoundException(`Role with ${id} not found`)
    }

    return this.save(role)
  }

  private async preloadPage(name: string): Promise<Page> {
    const existingPage = await this.pageRepository.findOne({ name })
    if (existingPage) {
      return existingPage
    } else {
      return this.pageRepository.create({ name })
    }
  }
}
