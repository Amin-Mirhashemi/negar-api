import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from 'src/post/post.module';
import { Post, PostSchema } from 'src/post/schemas/post.schema';
import { Comment, CommentSchema } from 'src/post/schemas/comment.schema';
import { Follow, FollowSchema } from 'src/user/schemas/follow.schema';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [
    PostModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Follow.name,
        schema: FollowSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
