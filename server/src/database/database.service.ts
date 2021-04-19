import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateClientDto, UpdateClientDto } from './dto/client.dto'
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto'
import { CreateProductDto, UpdateProductDto } from './dto/product.dto'
import { CreateShipperDto, UpdateShipperDto } from './dto/shipper.dto'
import { ClientDirectors } from './entities/client-directors.entity'
import { Client } from './entities/client.entity'
import { Department } from './entities/department.entity'
import { Product } from './entities/product.entity'
import { Shipper } from './entities/shipper.entity'

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Client)
    readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientDirectors)
    readonly clientDirectorRepository: Repository<ClientDirectors>,
    @InjectRepository(Product)
    readonly productRepository: Repository<Product>,
    @InjectRepository(Shipper)
    readonly shipperRepository: Repository<Shipper>,
    @InjectRepository(Department)
    readonly departmentRepository: Repository<Department>,
  ) {}

  getAllClients() {
    return this.clientRepository.find()
  }

  async createClient(createClientDto: CreateClientDto) {
    const { date, name, info, directors } = createClientDto
    const clientDirectors = await Promise.all(
      directors.map((name) => this.clientDirectorRepository.create({ name })),
    )
    const client = new Client()
    client.name = name
    client.date = new Date(date)
    client.info = info
    client.directors = clientDirectors

    return this.clientRepository.save(client)
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto) {
    const { directors, ...otherData } = updateClientDto
    const client = await this.clientRepository.preload({
      id,
      ...otherData,
    })

    if (!client) {
      throw new NotFoundException(`Client with #${id} not found`)
    }

    const clientDirectors = await Promise.all(
      directors.map((d: ClientDirectors) => this.preloadClientDirectors(d)),
    )
    client.directors = clientDirectors
    return this.clientRepository.save(client)
  }

  async deleteClient(id: number) {
    const client = await this.clientRepository.findOne(id)

    if (!client) {
      throw new NotFoundException(`Client with #${id} not found`)
    }

    this.clientRepository.remove(client)
  }

  private async preloadClientDirectors(director: ClientDirectors) {
    if (director.id) {
      return await this.clientDirectorRepository.preload(director)
    }
    return this.clientDirectorRepository.create({ name: director.name })
  }
  // end of client

  // Shipper
  getAllShippers() {
    return this.shipperRepository.find()
  }

  createShipper(createShipperDto: CreateShipperDto) {
    const { name } = createShipperDto
    const shipper = new Shipper()
    shipper.name = name

    return this.shipperRepository.save(shipper)
  }

  async updateShipper(id: number, updateShipperDto: UpdateShipperDto) {
    const shipper = await this.shipperRepository.preload({
      id,
      ...updateShipperDto,
    })

    if (!shipper) {
      throw new NotFoundException(`shipper with #${id} not found`)
    }

    return this.shipperRepository.save(shipper)
  }

  async deleteShipper(id: number) {
    const shipper = await this.shipperRepository.findOne(id)

    if (!shipper) {
      throw new NotFoundException(`shipper with #${id} not found`)
    }

    this.shipperRepository.remove(shipper)
  }
  // Products
  getAllProducts() {
    return this.productRepository.find()
  }

  createProduct(createProductDto: CreateProductDto) {
    const { name } = createProductDto
    const product = new Product()
    product.name = name

    return this.productRepository.save(product)
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    })

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`)
    }

    return this.productRepository.save(product)
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne(id)

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`)
    }

    this.productRepository.remove(product)
  }
  // Department
  getAllDepartments() {
    return this.departmentRepository.find()
  }

  createDepartment(createDepartment: CreateDepartmentDto) {
    const { name } = createDepartment
    const department = new Department()
    department.name = name

    return this.departmentRepository.save(department)
  }

  async updateDepartment(id: number, updateDepartment: UpdateDepartmentDto) {
    const department = await this.departmentRepository.preload({
      id,
      ...updateDepartment,
    })

    if (!department) {
      throw new NotFoundException(`department with #${id} not found`)
    }

    return this.departmentRepository.save(department)
  }

  async deleteDepartment(id: number) {
    const department = await this.departmentRepository.findOne(id)
    console.log('department', department)
    if (!department) {
      throw new NotFoundException(`department with #${id} not found`)
    }

    return this.departmentRepository.remove(department)
  }
}
