import { NotFoundException } from '@nestjs/common'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { CreatePageDto, UpdatePageDto } from './dto/pages.dto'
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto'
import { Page } from './entities/page.entity'
import { Role } from './entities/role.entity'

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  private pageRepository = getRepository(Page)

  async createRole(createRoleDto: CreateRoleDto) {
    const pages = await Promise.all(
      createRoleDto.pages.map((page: CreatePageDto) => this.createPage(page)),
    )

    const role = this.create({
      ...createRoleDto,
      pages,
    })
    return this.save(role)
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.preload({
      id,
      ...updateRoleDto,
    })
    if (!role) {
      throw new NotFoundException(`Role with ${id} not found`)
    }

    const pages = await Promise.all(
      updateRoleDto.pages.map((page: UpdatePageDto) =>
        this.preloadPage(page, role.pages),
      ),
    )
    role.pages = pages
    return this.save(role)
  }

  private async createPage(page: CreatePageDto): Promise<Page> {
    return this.pageRepository.create(page)
  }

  private async preloadPage(
    pageDto: UpdatePageDto,
    existPages: Page[],
  ): Promise<Page> {
    const page = existPages.find((p) => p.value === pageDto.value)
    if (page && page.id) {
      const newPage = await this.pageRepository.preload({
        id: page.id,
        ...pageDto,
      })
      return newPage
    }
    return this.pageRepository.create(pageDto)
  }
}
