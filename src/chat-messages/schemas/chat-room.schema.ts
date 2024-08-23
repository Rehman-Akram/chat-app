import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], ref: 'User' })
  participants: MongooseSchema.Types.ObjectId[];

  @Prop()
  name: string; // For group chats

  @Prop({ type: Boolean, default: false, required: true })
  isGroupChat: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  lastMessage: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
