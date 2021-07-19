const fs = require('fs')
const path = require('path')

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from 'src/database/entities/client.entity'
import { Shipper } from 'src/database/entities/shipper.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import { Connection, Repository } from 'typeorm'
import {
  ContractNumberDto,
  CreateContractClientDto,
  CreateContractDto,
  CreateContractShipperDto,
} from './contract.dto'
import { ContractClient } from './entities/contract-clients'
import { ContractDocuments } from './entities/contract-documents.entity'
import { ContractFiles } from './entities/contract-files.entity'
import { ContractNumbers } from './entities/contract-numbers.entity'
import { ContractShippers } from './entities/contract-shippers.entity'

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractDocuments)
    private readonly contractDocumentsRepository: Repository<ContractDocuments>,
    @InjectRepository(ContractClient)
    private readonly contractClientRepository: Repository<ContractClient>,
    @InjectRepository(ContractShippers)
    private readonly contractShippersRepository: Repository<ContractShippers>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Shipper)
    private readonly shipperRepository: Repository<Shipper>,
    @InjectRepository(ContractNumbers)
    private readonly contractNumberRepository: Repository<ContractNumbers>,
    @InjectRepository(ContractFiles)
    private readonly contractFileRepository: Repository<ContractFiles>,
    private connection: Connection,
  ) {}

  async findAllContracts() {
    return this.contractDocumentsRepository.find()
  }

  async findContractClients(documentTypeId: number) {
    return this.contractClientRepository.find({
      relations: ['document'],
      where: {
        document: {
          id: documentTypeId,
        },
      },
    })
  }

  async findContractShippers(clientId: number) {
    return this.contractShippersRepository.find({
      relations: ['shipper'],
      where: {
        client: {
          id: clientId,
        },
      },
    })
  }

  findAllNumbersByContractId(contractId: number) {
    return this.connection
      .createQueryBuilder()
      .select('contractNumber.id')
      .addSelect('contractNumber.number')
      .from(ContractNumbers, 'contractNumber')
      .leftJoin('contractNumber.contract', 'contract')
      .leftJoinAndSelect('contractNumber.files', 'files')
      .where('contract.id = :contractId', { contractId })
      .orderBy('files.date', 'DESC')
      .getMany()
  }

  findAllContractsForOrder(clientId: number, shipperId: number) {
    return this.connection
      .createQueryBuilder()
      .select('contractClient.id')
      .from(ContractClient, 'contractClient')
      .leftJoinAndSelect('contractClient.document', 'document')
      .leftJoinAndSelect('document.documentType', 'documentType')
      .leftJoin('contractClient.client', 'client')
      .leftJoinAndSelect('contractClient.shippers', 'shippers')
      .leftJoin('shippers.shipper', 'shipper')
      .leftJoinAndSelect('shippers.numbers', 'numbers')
      .leftJoinAndSelect('numbers.files', 'files')
      .where('shipper.id = :shipperId AND client.id = :clientId', {
        shipperId,
        clientId,
      })
      .getMany()
  }

  async createContract(createContractDto: CreateContractDto) {
    const { documentTypeId } = createContractDto

    const documentType = await this.documentTypeRepository.findOne(
      documentTypeId,
    )
    if (!documentType) {
      throw new NotFoundException(
        `Document with ${documentTypeId} is not found`,
      )
    }

    const contract = this.contractDocumentsRepository.create({
      documentType,
    })

    return this.contractDocumentsRepository.save(contract)
  }

  async createContractClient(dto: CreateContractClientDto) {
    const { documentTypeId, clientId } = dto

    const document = await this.contractDocumentsRepository.findOne({
      id: documentTypeId,
    })
    if (!document) {
      throw new NotFoundException(
        `Document with ${documentTypeId} is not found`,
      )
    }

    const client = await this.clientRepository.findOne(clientId)

    const contractClient = this.contractClientRepository.create({
      document,
      client,
    })

    return this.contractClientRepository.save(contractClient)
  }

  async deleteContractDocument(id: number) {
    const document = await this.contractDocumentsRepository.findOne(id)

    if (!document) {
      throw new NotFoundException(`document with #${id} is not found`)
    }
    return this.contractDocumentsRepository.remove(document)
  }

  async deleteContractClient(id: number) {
    const client = await this.contractClientRepository.findOne(id)

    if (!client) {
      throw new NotFoundException(`client with #${id} is not found`)
    }
    return this.contractClientRepository.remove(client)
  }

  async deleteContractShipper(id: number) {
    const shipper = await this.contractShippersRepository.findOne(id)

    if (!shipper) {
      throw new NotFoundException(`client with #${id} is not found`)
    }
    return this.contractShippersRepository.remove(shipper)
  }

  async createContractShipper(dto: CreateContractShipperDto) {
    const { shipperId, clientId } = dto

    const shipper = await this.shipperRepository.findOne(shipperId)
    if (!shipper) {
      throw new NotFoundException(`Shipper with ${shipperId} is not found`)
    }

    const client = await this.contractClientRepository.findOne(clientId)
    if (!client) {
      throw new NotFoundException(`Client with ${clientId} is not found`)
    }

    const contractShipper = this.contractShippersRepository.create({
      client,
      shipper,
    })

    return this.contractShippersRepository.save(contractShipper)
  }

  async addContractNumber(contractNumberDto: ContractNumberDto) {
    const { shipperId, number } = contractNumberDto
    const shipper = await this.contractShippersRepository.findOne(shipperId)

    if (!shipper) {
      throw new NotFoundException(`shipper with #${shipperId} is not found`)
    }
    const contractNumber = this.contractNumberRepository.create({
      contract: shipper,
      number,
    })
    return this.contractNumberRepository.save(contractNumber)
  }

  async deleteContractNumber(id: number) {
    const number = await this.contractNumberRepository.findOne(id)

    if (!number) {
      throw new NotFoundException(`Number with #${id} is not found`)
    }
    return this.contractNumberRepository.remove(number)
  }

  async addContractFile(file: Express.Multer.File, id: number) {
    const number = await this.contractNumberRepository.preload({ id })

    if (!number) {
      throw new NotFoundException(`Number with #${id} is not found`)
    }
    const newFile = this.contractFileRepository.create({
      file: file.filename,
      name: file.originalname,
      date: new Date(),
    })
    number.files = number.files.concat([newFile])
    await this.contractNumberRepository.save(number)
    return newFile
  }

  async deleteContractFile(id: number) {
    const file = await this.contractFileRepository.findOne(id)

    if (!file) {
      throw new NotFoundException(`File with #${id} is not found`)
    }
    try {
      fs.unlinkSync(path.resolve('uploads', file.file))
    } catch (error) {
      console.log('error', error)
    }
    return this.contractFileRepository.remove(file)
  }
}
