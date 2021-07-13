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
import {
  ContractNumberDto,
  CreateContractClientDto,
  CreateContractDto,
  CreateContractShipperDto,
} from './contract.dto'
import { ContractService } from './contract.service'

@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('/')
  createContract(@Body() createContractDto: CreateContractDto) {
    return this.contractService.createContract(createContractDto)
  }

  @Post('/client')
  createContractClient(
    @Body() createContractClientDto: CreateContractClientDto,
  ) {
    return this.contractService.createContractClient(createContractClientDto)
  }

  @Post('/shipper')
  createContractShipper(
    @Body() createContractShipperDto: CreateContractShipperDto,
  ) {
    return this.contractService.createContractShipper(createContractShipperDto)
  }

  @Get('/')
  findAllContracts(
    @Query('documentTypeId') docuemntTypeId: number,
    @Query('clientId') clientId: number,
  ) {
    if (clientId) {
      return this.contractService.findContractShippers(clientId)
    }
    if (docuemntTypeId) {
      return this.contractService.findContractClients(docuemntTypeId)
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

  @Post('/number')
  addContractNumber(@Body() contractNumberDto: ContractNumberDto) {
    return this.contractService.addContractNumber(contractNumberDto)
  }

  @Delete('/number/:id')
  deleteContractNumber(@Param('id') id: number) {
    return this.contractService.deleteContractNumber(id)
  }

  @Delete('/client/:id')
  deleteContractClient(@Param('id') id: number) {
    return this.contractService.deleteContractClient(id)
  }

  @Delete('/document/:id')
  deleteContractDocument(@Param('id') id: number) {
    return this.contractService.deleteContractDocument(id)
  }

  @Delete('/shipper/:id')
  deleteContractShipper(@Param('id') id: number) {
    return this.contractService.deleteContractShipper(id)
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
    return this.contractService.addContractFile(file, id)
  }

  @Delete('/file/:id')
  deleteContractFile(@Param('id') id: number) {
    return this.contractService.deleteContractFile(id)
  }
}
