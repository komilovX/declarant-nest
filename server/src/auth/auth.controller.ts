import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common'
import { Public } from 'src/common/decorators/public.decorator'
import { AuthService } from './auth.service'
import {
  SignInCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto)
  }

  @Public()
  @Post('/signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto)
  }

  @Get('/users')
  getAllUsers(@Query('type') role: any) {
    return this.authService.getAllUsers(role)
  }

  @Get('/profile')
  getProfile(@Req() req) {
    return req.user
  }

  @Get('/user/:id')
  getUserById(@Param('id') id: number) {
    return this.authService.getUserById(id)
  }

  @Put('/user/:id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto)
  }

  @Delete('/user/:id')
  deleteUser(@Param('id') id: number) {
    return this.authService.deleteUser(id)
  }
}
