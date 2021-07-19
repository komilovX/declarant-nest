import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { NotificationsService } from 'src/notifications/notifications.service'
import { FindOrderGridDto } from 'src/orders/order.dto'
import { DocumentStatus } from 'src/utils/lib/types'
import { notificationUtils } from 'src/utils/notification.util'
import { Document } from './document.entity'
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

  async updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    const doc = await this.documentRepository.findOne({
      relations: ['order'],
      where: { id },
    })

    const document = this.documentRepository.updateDocument(
      id,
      updateDocumentDto,
    )

    if (updateDocumentDto.status) {
      this.createNotification(doc, updateDocumentDto.status)
    }
    return document
  }

  async giveTask(user: User, giveTaskDocumentDto: GiveTaskDocumentDto) {
    const document = await this.documentRepository.giveTask(
      giveTaskDocumentDto,
      user,
    )

    this.notificationService.createNotification(
      notificationUtils.documentGivenToYou(
        document.documentType,
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

  private createNotification(document: Document, status: DocumentStatus) {
    if (status === 'DONE') {
      this.notificationService.createNotification(
        notificationUtils.documentDone(
          document.documentType,
          document.order.id,
        ),
        [document.creator.id],
      )
    } else if (status === 'RETURNED') {
      this.notificationService.createNotification(
        notificationUtils.documentReturned(
          document.documentType,
          document.order.id,
        ),
        [document.declarant.id],
      )
    }
  }
}
