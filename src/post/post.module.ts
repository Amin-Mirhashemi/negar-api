import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { PostService } from './post.service';
import { CommentController, PostController } from './post.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [PostService],
  controllers: [PostController, CommentController],
})
export class PostModule {}
