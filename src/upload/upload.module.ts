import * as multerS3 from 'multer-s3';
import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multerS3({
          s3: new S3Client({
            endpoint: process.env.BUCKET_ENDPOINT,
            credentials: {
              accessKeyId: process.env.BUCKET_ACCESS_KEY || '',
              secretAccessKey: process.env.BUCKET_SECRET_KEY || '',
            },
            region: 'default',
          }),
          bucket: 'negar',
          key: function (req: any, file: any, cb: any) {
            cb(
              null,
              Math.random().toString().split('.')[1] + '-' + file.originalname,
            );
          },
        }),
      }),
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
