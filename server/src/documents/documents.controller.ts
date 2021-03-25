import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { editFileName } from 'src/utils/file-uploading.utils'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'

@Controller('documents')
export class DocumentsController {
  constructor(private documentService: DocumentsService) {}

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 30 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: User,
    @UploadedFiles() files,
  ) {
    const multerFiles = files.files as Express.Multer.File[]
    return this.documentService.createDocument(
      createDocumentDto,
      multerFiles,
      user,
    )
  }

  @Get('/')
  getAllDocuments() {
    return this.documentService.getAllDocuments()
  }

  @Put('/:id')
  updateDocument(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.updateDocument(id, updateDocumentDto)
  }

  @Patch('/deleteFile/:id')
  deleteDocumentFile(@Param('id') id: number, @Body('file') file: string) {
    return this.documentService.deleteDocumentFile(id, file)
  }

  @Patch('/file/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  addDocumentFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentService.addDocumentFile(id, file)
  }

  @Delete('/:id')
  deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id)
  }
}
