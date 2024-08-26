import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEnum } from '../enums/message.enum';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @ApiProperty({ type: String })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: MessageEnum, default: MessageEnum.TEXT })
  type: MessageEnum;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  })
  chatRoom: MongooseSchema.Types.ObjectId;

  @Prop({ type: Boolean, default: false, required: true })
  isRead: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
