import { Controller, Get, Param, Res } from '@nestjs/common'
import { Public } from './common/decorators/public.decorator'

@Controller()
export class AppController {
  @Public()
  @Get('uploads/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'uploads' })
  }
}
