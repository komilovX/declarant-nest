import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './document-type.dto'
import { DocumentTypeService } from './document-type.service'

@Controller('document-type')
export class DocumentTypeController {
  constructor(private documentTypeService: DocumentTypeService) {}

  @Get('/')
  getAllDocumentType() {
    return this.documentTypeService.getAllDocumentTypes()
  }

  @Post('/')
  createDocumentType(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypeService.createDocumentType(createDocumentTypeDto)
  }

  @Put('/:id')
  updateDocumentType(
    @Param('id') id: number,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    return this.documentTypeService.updateDocumentType(
      id,
      updateDocumentTypeDto,
    )
  }

  @Delete('/:id')
  deleteDocumentType(@Param('id') id: number) {
    return this.documentTypeService.deleteDocumentType(id)
  }
}
