const fs = require('fs')
const path = require('path')

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from 'src/database/entities/client.entity'
import { Shipper } from 'src/database/entities/shipper.entity'
import { DocumentType } from 'src/document-type/document-type.entity'
import { Connection, Repository } from 'typeorm'
import { CreateContractDto } from './contract.dto'
import { ContractFiles } from './entities/contract-files.entity'
import { ContractNumbers } from './entities/contract-numbers.entity'
import { Contract } from './entities/contract.entity'

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
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
    return this.connection
      .createQueryBuilder()
      .select('contract.documentTypeId')
      .from(Contract, 'contract')
      .distinctOn(['contract.documentTypeId'])
      .leftJoinAndSelect('contract.documentType', 'document')
      .getMany()
  }

  async findAllClientsById(documentTypeId: number) {
    return this.contractRepository.find({
      select: ['documentTypeId'],
      relations: ['client'],
      where: { documentTypeId },
    })
  }

  async findAllShippersById(documentTypeId: number, clientId: number) {
    return this.contractRepository.find({
      select: ['documentTypeId', 'id'],
      relations: ['client', 'shipper'],
      where: { documentTypeId, client: { id: clientId } },
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

  async createContract(createContractDto: CreateContractDto) {
    const { clientId, documentTypeId, shipperId } = createContractDto

    const client = await this.clientRepository.findOne(clientId)
    if (!client) {
      throw new NotFoundException(`Client with ${clientId} is not found`)
    }

    const documentType = await this.documentTypeRepository.findOne(
      documentTypeId,
    )
    if (!documentType) {
      throw new NotFoundException(
        `Document with ${documentTypeId} is not found`,
      )
    }

    const shipper = await this.shipperRepository.findOne(shipperId)
    if (!shipper) {
      throw new NotFoundException(`Shipper with ${shipperId} is not found`)
    }

    const contract = this.contractRepository.create({
      documentType,
      client,
      shipper,
    })

    return this.contractRepository.save(contract)
  }

  async addNumberContract(id: number, number: string) {
    const contract = await this.contractRepository.preload({
      id,
    })

    if (!contract) {
      throw new NotFoundException(`Contract with id #${id} is not found`)
    }

    const newNumber = this.contractNumberRepository.create({ number })
    contract.numbers = contract.numbers.concat(newNumber)
    await this.contractRepository.save(contract)

    return newNumber
  }

  async deleteContractNumber(id: number) {
    const number = await this.contractNumberRepository.findOne(id)

    if (!number) {
      throw new NotFoundException(`Number with #${id} is not found`)
    }
    return this.contractNumberRepository.remove(number)
  }

  async addContractFile(fileName: string, id: number) {
    const number = await this.contractNumberRepository.preload({ id })

    if (!number) {
      throw new NotFoundException(`Number with #${id} is not found`)
    }
    const newFile = this.contractFileRepository.create({
      file: fileName,
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
