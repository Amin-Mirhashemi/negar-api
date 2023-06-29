import {
  Injectable,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dtos/createPost.dto';
import { EditPostDto } from './dtos/editPost.dto';
import { CreateCommentDto } from './dtos/createComment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { EditCommentDto } from './dtos/editComment.dto';
import { Like, LikeDocument } from './schemas/like.schema';
import { LikeDto } from './dtos/like.dto';
import { UserService } from 'src/user/user.service';
import { Tag, TagDocument } from './schemas/tag.schema';
import { VoteDto } from './dtos/vote.dto';
import { Vote, VoteDocument } from './schemas/vote.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Like.name) private LikeModel: Model<LikeDocument>,
    @InjectModel(Tag.name) private TagModel: Model<TagDocument>,
    @InjectModel(Vote.name) private VoteModel: Model<VoteDocument>,
    private userService: UserService,
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

    return {
      result: true,
      id: String(post._id),
    };
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

  async like(body: LikeDto, id: string) {
    const likeObject = this.likeObject(id, body.entityId);

    const liked = await this.hasBeenLiked(id, body.entityId);
    if (liked) {
      throw new NotAcceptableException('liked already');
    }

    await new this.LikeModel(likeObject).save();
    return 'liked successfully';
  }

  async unlike(body: LikeDto, id: string) {
    await this.LikeModel.findOneAndDelete(this.likeObject(id, body.entityId));
    return 'unliked successfully';
  }

  likeObject(user: string, entity: string) {
    return { user: this.toId(user), entity: this.toId(entity) };
  }

  async hasBeenLiked(user: string, entity: string): Promise<boolean> {
    const like = this.likeObject(user, entity);
    const likeInstance = await this.LikeModel.findOne(like).exec();
    return !!likeInstance;
  }

  async mapper(entity: any, user: string) {
    const [likesCount, isLiked, creator, tags] = await Promise.all([
      this.LikeModel.countDocuments({ entity: entity._id }),
      this.hasBeenLiked(user, String(entity._id)),
      this.userService.getUser(entity.creator, user),
      !!entity.postId ? undefined : this.getVotes(user, entity._id),
    ]);
    return {
      ...entity,
      creator,
      like_count: likesCount,
      is_liked_by_current_user: isLiked,
      user_votes: tags?.userVotes,
      post_tags: tags?.postTags,
    };
  }

  async getComments(postId: string, userId: string) {
    const comments = await this.CommentModel.find({
      postId: this.toId(postId),
    })
      .lean()
      .exec();
    const mappedComments = await Promise.all(
      comments.map(async (c) => this.mapper(c, userId)),
    );

    return mappedComments.map((c) => {
      return {
        ...c,
        replyOn:
          c.replyOn &&
          mappedComments.find(
            (comment) => String(comment._id) == String(c.replyOn),
          ),
      };
    });
  }

  async getPost(
    postId: string,
    userId: string,
    repost?: boolean,
  ): Promise<any> {
    const post = await this.PostModel.findById(postId).lean().exec();

    if (!post) {
      throw new BadRequestException('post does not exist');
    }

    if (repost) {
      return await this.mapper(post, userId);
    }

    const [mapped, comments, repostCount, repostOn] = await Promise.all([
      this.mapper(post, userId),
      this.getComments(postId, userId),
      this.PostModel.countDocuments({
        repostOn: this.toId(postId),
      }),
      post.repostOn && this.getPost(String(post.repostOn), userId, true),
    ]);

    return {
      ...mapped,
      comments,
      comment_count: comments.length,
      repost_count: repostCount,
      repostOn,
    };
  }

  async createTag(label: string, title: string) {
    await new this.TagModel({ label, title }).save();
    return 200;
  }

  private cachedTags: Tag[];

  async getTags() {
    if (this.cachedTags) {
      return this.cachedTags;
    }

    const tags = await this.TagModel.find().lean().exec();

    this.cachedTags = tags;

    return tags;
  }

  async vote(userId: string, payload: VoteDto) {
    const voteObject = {
      user: this.toId(userId),
      post: this.toId(payload.postId),
      tag: this.toId(payload.tagId),
    };

    const existingVote = await this.VoteModel.findOne(voteObject).exec();

    if (existingVote) {
      throw new BadRequestException('you cant vote for the same tag twice');
    }

    await new this.VoteModel(voteObject).save();

    return 'vote applied successfully';
  }

  async unvote(userId: string, payload: VoteDto) {
    await this.VoteModel.findOneAndDelete({
      user: this.toId(userId),
      post: this.toId(payload.postId),
      tag: this.toId(payload.tagId),
    });
    return 'vote deleted';
  }

  async getVotes(userId: string, postId: mongoose.Types.ObjectId) {
    const [allVotes, tags] = await Promise.all([
      this.VoteModel.find({ post: postId }).lean().exec(),
      this.getTags(),
    ]);

    const counters: Record<string, number> = {};
    const userVotes: mongoose.Types.ObjectId[] = [];
    const postTags: mongoose.Types.ObjectId[] = [];

    allVotes.forEach((vote) => {
      const tag = vote.tag.toString();

      counters[tag] = (counters[tag] || 0) + 1;
      if (counters[tag] === 4) postTags.push(vote.tag);

      if (vote.user.toString() === userId) userVotes.push(vote.tag);
    });

    const tagIdToObject = (tagId: mongoose.Types.ObjectId) => {
      return tags.find((tag) => String(tag._id) === String(tagId));
    };

    return {
      userVotes: userVotes.map(tagIdToObject),
      postTags: postTags.map(tagIdToObject),
    };
  }

  toId(id: string) {
    try {
      return new mongoose.Types.ObjectId(id);
    } catch {
      throw new BadRequestException('id is not valid');
    }
  }
}
