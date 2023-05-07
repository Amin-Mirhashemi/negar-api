import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EditUserDto } from './dtos/edit.dto';
import { FollowDto } from './dtos/follow.dto';
import { Follow, FollowDocument } from './schemas/follow.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    private jwtService: JwtService,
  ) {
    this.saltRound = 10;
  }

  private saltRound: number;

  async createUser(user: User): Promise<any> {
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
      throw new NotAcceptableException('Username is already taken');
    }

    user.password = await bcrypt.hash(user.password, this.saltRound);

    const createdUser = new this.userModel(user);
    await createdUser.save();
    const payload = { sub: createdUser._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async findById(id: string) {
    const ObjectId = this.toId(id);
    return this.userModel.findById(ObjectId).exec();
  }

  async findByIdLean(id: string) {
    const ObjectId = this.toId(id);
    return this.userModel.findById(ObjectId).lean().exec();
  }

  async findByIds(ids: mongoose.Types.ObjectId[]) {
    const users = await this.userModel
      .find({
        _id: { $in: ids },
      })
      .lean()
      .exec();
    return users.map((u) => this.removePassword(u));
  }

  removePassword(u: any) {
    const { password, ...rest } = u;
    return rest;
  }

  toId(id: string) {
    return new mongoose.Types.ObjectId(id);
  }

  async editUser(id: string, body: EditUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new UnprocessableEntityException();
    }
    if (body.username && body.username != user.username) {
      const existingUser = await this.findByUsername(body.username);
      if (existingUser) {
        throw new NotAcceptableException('Username is already taken');
      }
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, this.saltRound);
    }

    Object.assign(user, body);
    await user.save();
    return 'edited successfully';
  }

  async followUser(id: string, body: FollowDto) {
    const followObject = await this.checkFollow(id, body);
    const existingFollow = await this.followModel.findOne(followObject).exec();

    if (existingFollow) {
      throw new NotAcceptableException('followed already');
    }

    const follow = new this.followModel(followObject);
    await follow.save();
    return 'followed successfully';
  }

  async unfollowUser(id: string, body: FollowDto) {
    const followObject = await this.checkFollow(id, body);
    const existingFollow = await this.followModel
      .findOneAndDelete(followObject)
      .exec();

    if (!existingFollow) {
      throw new NotAcceptableException('not following');
    }

    return 'unfollowed successfully';
  }

  async checkFollow(id: string, body: FollowDto): Promise<Follow> {
    const user = await this.findById(id);

    if (!user) {
      throw new UnprocessableEntityException();
    }

    const followingUser = await this.findById(body.userId);
    if (!followingUser) {
      throw new BadRequestException('user does not exist');
    }

    return {
      follower: this.toId(id),
      following: this.toId(body.userId),
    };
  }

  async follows(id: string, role: 'follower' | 'following') {
    const follows = await this.followModel
      .find({ [role]: this.toId(id) })
      .lean()
      .exec();
    return follows;
  }

  async getUser(id: string, currentId?: string) {
    const user = await this.findByIdLean(id);

    if (!user) {
      throw new UnprocessableEntityException();
    }

    return await this.userMapper(id, user, currentId);
  }

  async getUserByUsername(username: string, currentId?: string) {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new UnprocessableEntityException('username not found');
    }

    return await this.userMapper(String(user._id), user, currentId);
  }

  async userMapper(id: string, user: User, currentId?: string) {
    const [followers, followings] = await Promise.all([
      this.follows(id, 'following'),
      this.follows(id, 'follower'),
    ]);
    const isFollowing = currentId
      ? !!followers.find((f) => String(f.follower) == currentId)
      : false;

    return {
      ...this.removePassword(user),
      follower_count: followers.length,
      following_count: followings.length,
      is_followed_by_current_user: isFollowing,
    };
  }

  async getFollowers(id: string) {
    const followers = (await this.follows(id, 'following')).map(
      (f) => f.follower,
    );
    return await this.findByIds(followers);
  }

  async getFollowings(id: string) {
    const followings = (await this.follows(id, 'follower')).map(
      (f) => f.following,
    );
    return await this.findByIds(followings);
  }
}
