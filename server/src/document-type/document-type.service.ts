import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Department } from 'src/database/entities/department.entity'
import { Repository } from 'typeorm'
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './document-type.dto'
import { DocumentType } from './document-type.entity'

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Department)
    private readonly deparmentRepository: Repository<Department>,
  ) {}

  async createDocumentType(createDocumentTypeDto: CreateDocumentTypeDto) {
    const { info, name, number, types } = createDocumentTypeDto
    const departments = await Promise.all(
      createDocumentTypeDto.departments.map((dep) =>
        this.deparmentRepository.findOne(dep),
      ),
    )
    const documentType = new DocumentType()
    documentType.info = info
    documentType.name = name
    documentType.number = number
    documentType.departments = departments
    documentType.types = types

    return this.documentTypeRepository.save(documentType)
  }

  getAllDocumentTypes() {
    return this.documentTypeRepository.find({ relations: ['departments'] })
  }

  async updateDocumentType(
    id: number,
    updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    const departments =
      updateDocumentTypeDto.departments &&
      (await Promise.all(
        updateDocumentTypeDto.departments.map((dep) =>
          this.deparmentRepository.findOne(dep),
        ),
      ))
    const documentType = await this.documentTypeRepository.preload({
      id,
      ...updateDocumentTypeDto,
      departments,
      types: updateDocumentTypeDto.types,
    })

    if (!documentType) {
      throw new NotFoundException(`Document Type with ${id} is not found`)
    }

    return this.documentTypeRepository.save(documentType)
  }

  async deleteDocumentType(id: number) {
    const documentType = await this.documentTypeRepository.findOne(id)

    if (!documentType) {
      throw new NotFoundException(`Document Type with ${id} is not found`)
    }

    return this.documentTypeRepository.remove(documentType)
  }
}
