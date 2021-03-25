import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto, FindOrderGridDto, UpdateOrderDto } from './order.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { editFileName } from 'src/utils/file-uploading.utils'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { User } from 'src/auth/user.entity'

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('/grid')
  findOrdersByGrid(
    @Body() findOrderGridDto: FindOrderGridDto,
    @Query('deleted') deleted: boolean,
    @Query('archived') archived: boolean,
  ) {
    return this.ordersService.findOrdersByGrid(findOrderGridDto, {
      deleted,
      archived,
    })
  }

  @Post('/declarant')
  findOrdersByDeclarant(
    @GetUser() user: User,
    @Body() findOrderGridDto: FindOrderGridDto,
  ) {
    return this.ordersService.findOrdersByUser(findOrderGridDto, user)
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 30 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
    @UploadedFiles() files,
  ) {
    const multerFiles = files.files as Express.Multer.File[]
    return this.ordersService.createOrder(createOrderDto, user, multerFiles)
  }

  @Put('/:id')
  updateOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto)
  }

  @Get('/:id')
  findOrderById(@Param('id') id: number) {
    return this.ordersService.findOrderById(id)
  }

  @Get('/detail/:id')
  findOrderByIdWithDetails(@Param('id') id: number) {
    return this.ordersService.findOrderByIdWithDetails(id)
  }
}
