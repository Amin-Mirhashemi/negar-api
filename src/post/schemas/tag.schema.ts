import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({ default: () => new mongoose.Types.ObjectId(), auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  title: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
