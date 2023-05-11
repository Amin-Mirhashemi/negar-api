import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { Comment, CommentDocument } from 'src/post/schemas/comment.schema';
import { Post, PostDocument } from 'src/post/schemas/post.schema';
import { Follow, FollowDocument } from 'src/user/schemas/follow.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(Follow.name) private FollowModel: Model<FollowDocument>,
    private postService: PostService,
  ) {}

  async getFeed(userId: string, offset: number, limit: number) {
    const followings = await this.getFollowings(userId);

    const posts = await this.getQuery(
      {
        ...this.timeFilter(),
        creator: { $in: followings },
      },
      offset,
      limit,
      userId,
    );

    return posts;
  }

  async getExplore(userId: string, offset: number, limit: number, search = '') {
    const followings = await this.getFollowings(userId);

    const posts = await this.getQuery(
      {
        ...this.timeFilter(),
        ...(search ? { $text: { $search: search } } : {}),
        $or: [
          {
            creator: { $in: followings },
          },
          {
            onlyFollowers: { $exists: false },
          },
          {
            onlyFollowers: false,
          },
        ],
      },
      offset,
      limit,
      userId,
    );

    return posts;
  }

  async getUserPosts(
    currentUser: string,
    offset: number,
    limit: number,
    userId: string,
  ) {
    const posts = await this.getQuery(
      {
        ...this.timeFilter(),
        creator: this.toId(userId),
      },
      offset,
      limit,
      currentUser,
    );

    return posts;
  }

  async getReposts(
    userId: string,
    offset: number,
    limit: number,
    postId: string,
  ) {
    const posts = await this.getQuery(
      {
        ...this.timeFilter(),
        repostOn: this.toId(postId),
      },
      offset,
      limit,
      userId,
    );

    return posts;
  }

  async getQuery(obj: any, offset: number, limit: number, user: string) {
    const posts = await this.PostModel.find(obj)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const mappedPosts = await Promise.all(
      posts.map(async (p) => {
        const [post, comment_count, repost_count, repostOn] = await Promise.all(
          [
            this.postService.mapper(p, user),
            this.CommentModel.countDocuments({
              postId: p._id,
            }),
            this.PostModel.countDocuments({
              repostOn: p._id,
            }),
            p.repostOn &&
              this.postService.getPost(String(p.repostOn), user, true),
          ],
        );

        return {
          ...post,
          comment_count,
          repost_count,
          repostOn,
        };
      }),
    );

    return mappedPosts;
  }

  async getFollowings(userId: string) {
    return (
      await this.FollowModel.find({
        follower: this.toId(userId),
      })
        .lean()
        .exec()
    ).map((f) => f.following);
  }

  timeFilter() {
    const now = Date.now();

    return {
      $and: [
        {
          $or: [
            { publishTime: { $exists: false } },
            { publishTime: { $lt: now } },
          ],
        },
        {
          $or: [
            { unpublishTime: { $exists: false } },
            { unpublishTime: { $gt: now } },
          ],
        },
      ],
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
