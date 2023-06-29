import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type VoteDocument = HydratedDocument<Vote>;

@Schema()
export class Vote {
  @Prop({ required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  post: mongoose.Types.ObjectId;

  @Prop({ required: true })
  tag: mongoose.Types.ObjectId;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
