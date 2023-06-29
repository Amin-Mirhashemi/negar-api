import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
    FeedModule,
    UploadModule,
  ],
})
export class AppModule {}
