import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto'
import { RoleRepository } from './role.repository'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  getRoles() {
    return this.roleRepository.find({
      relations: ['pages'],
    })
  }

  createRole(createRoleDto: CreateRoleDto) {
    return this.roleRepository.createRole(createRoleDto)
  }

  updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.updateRole(id, updateRoleDto)
  }

  async deleteRole(id: number) {
    const removingRole = await this.roleRepository.findOne(id)

    if (!removingRole) {
      throw new NotFoundException(`Role with ${id} is not found`)
    }

    return this.roleRepository.remove(removingRole)
  }
}
