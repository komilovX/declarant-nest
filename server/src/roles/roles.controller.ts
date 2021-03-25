import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Public } from 'src/common/decorators/public.decorator'
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto'
import { RolesService } from './roles.service'

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Public()
  @Post('/')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto)
  }

  @Get('/')
  getRoles() {
    return this.rolesService.getRoles()
  }

  @Put('/:id')
  updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto)
  }

  @Delete('/:id')
  deleteRole(@Param('id') id: number) {
    return this.rolesService.deleteRole(id)
  }
}
