import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ default: () => new mongoose.Types.ObjectId(), auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true, index: 'text' })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  name?: string;

  @Prop({ default: '' })
  avatar?: string;

  @Prop({ default: '' })
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
