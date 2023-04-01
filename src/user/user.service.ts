import {
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EditDto } from './dtos/edit.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    return this.userModel.findOne({ username }).exec();
  }

  async editUser(id: string, body: EditDto) {
    const ObjectId = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findById(ObjectId).exec();

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
}
