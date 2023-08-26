import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { PostService } from './post.service';
import {
  CommentController,
  LikeController,
  PostController,
  VoteController,
} from './post.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { UserModule } from 'src/user/user.module';
import { Tag, TagSchema } from './schemas/tag.schema';
import { Vote, VoteSchema } from './schemas/vote.schema';

@Module({
  imports: [
    UserModule,
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
        name: Like.name,
        schema: LikeSchema,
      },
      {
        name: Tag.name,
        schema: TagSchema,
      },
      {
        name: Vote.name,
        schema: VoteSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [PostService],
  controllers: [
    PostController,
    CommentController,
    LikeController,
    // VoteController,
  ],
  exports: [PostService],
})
export class PostModule {}
