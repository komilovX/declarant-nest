import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { editFileName } from 'src/utils/file-uploading.utils'
import { CreateContractDto } from './contract.dto'
import { ContractService } from './contract.service'

@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('/')
  createContract(@Body() createContractDto: CreateContractDto) {
    return this.contractService.createContract(createContractDto)
  }

  @Get('/')
  findAllContracts(
    @Query('documentTypeId') docuemntTypeId: number,
    @Query('clientId') clientId: number,
    @Query('contractId') contractId: number,
  ) {
    if (docuemntTypeId && clientId) {
      return this.contractService.findAllShippersById(docuemntTypeId, clientId)
    }
    if (docuemntTypeId) {
      return this.contractService.findAllClientsById(docuemntTypeId)
    }
    if (contractId) {
      return this.contractService.findAllNumbersByContractId(contractId)
    }
    return this.contractService.findAllContracts()
  }

  @Get('/orders')
  findContractsForOrder(
    @Query('clientId') clientId: number,
    @Query('shipperId') shipperId: number,
  ) {
    return this.contractService.findAllContractsForOrder(clientId, shipperId)
  }

  @Put('/number/:id')
  addNumberContract(@Body('number') number: string, @Param('id') id: number) {
    return this.contractService.addNumberContract(id, number)
  }

  @Delete('/number/:id')
  deleteContractNumber(@Param('id') id: number) {
    return this.contractService.deleteContractNumber(id)
  }

  @Put('/file/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  addContractFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    console.log('file', file)
    return this.contractService.addContractFile(file.filename, id)
  }

  @Delete('/file/:id')
  deleteContractFile(@Param('id') id: number) {
    return this.contractService.deleteContractFile(id)
  }
}
