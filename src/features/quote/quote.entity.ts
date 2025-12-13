import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tag } from '../tag/tag.entity';

@Schema({ timestamps: true })
export class Quote {
  @Prop({ required: true })
  quote: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  authorAbout: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];
}

export type QuoteDocument = HydratedDocument<Quote>;
export const QuoteSchema = SchemaFactory.createForClass(Quote);
