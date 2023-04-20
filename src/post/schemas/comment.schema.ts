import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  creator: mongoose.Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  postId: mongoose.Types.ObjectId;

  @Prop({ default: Date.now, auto: true })
  createdAt?: number;

  @Prop()
  replyOn?: mongoose.Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
