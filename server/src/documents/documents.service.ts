import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { DocumentRepository } from './document.repository'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
  ) {}

  createDocument(
    createDocumentDto: CreateDocumentDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    return this.documentRepository.cretateDocument(
      createDocumentDto,
      files,
      user,
    )
  }

  getAllDocuments() {
    return this.documentRepository.find()
  }

  updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    return this.documentRepository.updateDocument(id, updateDocumentDto)
  }

  addDocumentFile(id: number, file: Express.Multer.File) {
    return this.documentRepository.addDocumentFile(id, file)
  }

  deleteDocumentFile(id: number, file: string) {
    return this.documentRepository.deleteDocumentFile(id, file)
  }

  deleteDocument(id: number) {
    return this.documentRepository.deleteDocument(id)
  }
}
