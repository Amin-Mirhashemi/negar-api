import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.MulterS3.File) {
    return file;
  }
}
