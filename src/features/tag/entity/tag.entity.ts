import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tag extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isSearched: boolean;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
