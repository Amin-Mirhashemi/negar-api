import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  entity: mongoose.Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
