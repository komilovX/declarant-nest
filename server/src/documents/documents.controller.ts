import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import {
  CreateDocumentDto,
  GiveTaskDocumentDto,
} from './dto/create-document.dto'
import { FindOrderGridDto } from 'src/orders/order.dto'
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

  @Post('/declarant')
  getAllDocumentsByUserId(
    @Body() findOrderGridDto: FindOrderGridDto,
    @Query('status') status: string | string[],
    @GetUser() user: User,
  ) {
    return this.documentService.getAllDocumentsByUserId(
      user,
      findOrderGridDto,
      status,
    )
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

  @Post('/giveTask')
  giveTask(
    @GetUser() user: User,
    @Body() giveTaskDocumentDto: GiveTaskDocumentDto,
  ) {
    return this.documentService.giveTask(user, giveTaskDocumentDto)
  }

  @Put('/updateTask/:id')
  updateTask(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() giveTaskDocumentDto: GiveTaskDocumentDto,
  ) {
    return this.documentService.updateTask(id, giveTaskDocumentDto, user)
  }

  @Delete('/:id')
  deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id)
  }
}
