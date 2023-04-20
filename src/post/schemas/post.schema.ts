import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  creator: mongoose.Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ default: '' })
  image?: string;

  @Prop()
  repostOn?: mongoose.Types.ObjectId;

  @Prop({ default: false })
  onlyFollowers?: boolean;

  @Prop({ default: Date.now, auto: true })
  createdAt?: number;

  @Prop()
  publishTime?: number;

  @Prop()
  unpublishTime?: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
