import {
  Injectable,
  BadRequestException,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dtos/createPost.dto';
import { EditPostDto } from './dtos/editPost.dto';
import { CreateCommentDto } from './dtos/createComment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { EditCommentDto } from './dtos/editComment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async createPost(body: CreatePostDto, id: string) {
    if (body.repostOn) await this.checkRepostExist(body.repostOn);

    const postObject: Post = {
      ...body,
      creator: this.toId(id),
      repostOn: body.repostOn ? this.toId(body.repostOn) : undefined,
    };
    const post = new this.PostModel(postObject);
    await post.save();

    return 'post created successfully';
  }

  async editPost(body: EditPostDto, id: string) {
    const post = await this.PostModel.findOne({
      _id: this.toId(body.id),
      creator: this.toId(id),
    });

    if (!post) {
      throw new NotAcceptableException(
        'the post does not exist or you cannot edit it',
      );
    }

    if (body.repostOn) await this.checkRepostExist(body.repostOn);

    const { id: Id, ...postObject } = {
      ...body,
      repostOn: body.repostOn ? this.toId(body.repostOn) : undefined,
    };
    Object.assign(post, postObject);
    await post.save();

    return 'post edited successfully';
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.PostModel.findOneAndDelete({
      _id: this.toId(postId),
      creator: this.toId(userId),
    }).exec();

    if (!post) {
      throw new NotAcceptableException(
        'the post does not exist or you cannot delete it',
      );
    }

    return 'post deleted successfully';
  }

  async createComment(body: CreateCommentDto, id: string) {
    await this.checkPostExist(body.postId, true);

    const commentObject: Comment = {
      text: body.text,
      creator: this.toId(id),
      postId: this.toId(body.postId),
      replyOn: body.replyOn ? this.toId(body.replyOn) : undefined,
    };
    const comment = new this.CommentModel(commentObject);
    await comment.save();

    return 'comment saved successfully';
  }

  async editComment(body: EditCommentDto, id: string) {
    const comment = await this.CommentModel.findOneAndUpdate(
      {
        _id: this.toId(body.id),
        creator: this.toId(id),
      },
      body,
    ).exec();

    if (!comment) {
      throw new NotAcceptableException(
        'the comment does not exist or you cannot edit it',
      );
    }

    return 'comment saved successfully';
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.CommentModel.findOneAndDelete({
      _id: this.toId(commentId),
      creator: this.toId(userId),
    }).exec();

    if (!comment) {
      throw new NotAcceptableException(
        'the comment does not exist or you cannot delete it',
      );
    }

    return 'comment deleted successfully';
  }

  async checkPostExist(id: string, withError?: boolean) {
    const post = await this.PostModel.findById(this.toId(id)).exec();
    if (withError && !post)
      throw new NotAcceptableException('post does not exist');
    return post;
  }

  async checkRepostExist(repostOn: string) {
    const repost = await this.checkPostExist(repostOn);
    if (!repost)
      throw new NotAcceptableException(
        'the post you are resharing does not exist',
      );
  }

  toId(id: string) {
    return new mongoose.Types.ObjectId(id);
  }
}
