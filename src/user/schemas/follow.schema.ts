import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema()
export class Follow {
  @Prop({ required: true })
  follower: mongoose.Types.ObjectId;

  @Prop({ required: true })
  following: mongoose.Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
