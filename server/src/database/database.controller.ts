import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { CreateClientDto, UpdateClientDto } from './dto/client.dto'
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto'
import { CreateProductDto, UpdateProductDto } from './dto/product.dto'
import { CreateShipperDto, UpdateShipperDto } from './dto/shipper.dto'

@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  // Client

  @Get('/client')
  getAllClients() {
    return this.databaseService.getAllClients()
  }

  @Post('/client')
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.databaseService.createClient(createClientDto)
  }

  @Put('/client/:id')
  updateClient(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.databaseService.updateClient(id, updateClientDto)
  }

  @Delete('/client/:id')
  deleteClient(@Param('id') id: number) {
    return this.databaseService.deleteClient(id)
  }

  // Shippers
  @Get('/shipper')
  getAllShippers() {
    return this.databaseService.getAllShippers()
  }

  @Post('/shipper')
  createShipper(@Body() createShipperDto: CreateShipperDto) {
    return this.databaseService.createShipper(createShipperDto)
  }

  @Put('/shipper/:id')
  updateShipper(
    @Param('id') id: number,
    @Body() updateShipperDto: UpdateShipperDto,
  ) {
    return this.databaseService.updateShipper(id, updateShipperDto)
  }

  @Delete('/shipper/:id')
  deleteShipper(@Param('id') id: number) {
    return this.databaseService.deleteShipper(id)
  }

  // Product
  @Get('/product')
  getAllProducts() {
    return this.databaseService.getAllProducts()
  }

  @Post('/product')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.databaseService.createProduct(createProductDto)
  }

  @Put('/product/:id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.databaseService.updateProduct(id, updateProductDto)
  }

  @Delete('/product/:id')
  deleteProduct(@Param('id') id: number) {
    return this.databaseService.deleteProduct(id)
  }

  // Department

  @Get('/department')
  getAllDepartments() {
    return this.databaseService.getAllDepartments()
  }

  @Post('/department')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.databaseService.createDepartment(createDepartmentDto)
  }

  @Put('/department/:id')
  updateDepartment(
    @Param('id') id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.databaseService.updateDepartment(id, updateDepartmentDto)
  }

  @Delete('/department/:id')
  deleteDepartment(@Param('id') id: number) {
    return this.databaseService.deleteDepartment(id)
  }
}
