import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { FindOrderGridDto } from 'src/orders/order.dto'
import { notificationUtils } from 'src/utils/notification.util'
import { DocumentRepository } from './document.repository'
import {
  CreateDocumentDto,
  GiveTaskDocumentDto,
} from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentRepository)
    private documentRepository: DocumentRepository,
    private notificationService: NotificationsService,
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

  getAllDocumentsByUserId(
    user: User,
    findOrderGridDto: FindOrderGridDto,
    status: string | string[],
  ) {
    return this.documentRepository.findDocumentsByUserId(
      user,
      findOrderGridDto,
      status,
    )
  }

  updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    return this.documentRepository.updateDocument(id, updateDocumentDto)
  }

  async giveTask(user: User, giveTaskDocumentDto: GiveTaskDocumentDto) {
    const document = await this.documentRepository.giveTask(
      giveTaskDocumentDto,
      user,
    )

    this.notificationService.createNotification(
      notificationUtils.documentGivenToYou(
        document.documentType.number,
        document.order.id,
      ),
      [document.declarant.id],
    )
    return document
  }

  updateTask(id: number, giveTaskDocumentDto: GiveTaskDocumentDto, user: User) {
    return this.documentRepository.updateTask(id, giveTaskDocumentDto, user)
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
