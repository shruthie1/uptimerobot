import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'users', versionKey: false, autoIndex: true })  // Specify the collection name here
export class User extends Document {
  @Prop()
  mobile: string;

  @Prop()
  session: string;

  @Prop()
  firstName: string;

  @Prop({ required: false })
  lastName: string | null;

  @Prop({ required: false })
  userName: string | null;

  @Prop()
  channels: number;

  @Prop()
  personalChats: number;

  @Prop()
  demoGiven: boolean;

  @Prop()
  msgs: number;

  @Prop()
  totalChats: number;

  @Prop()
  lastActive: number;

  @Prop()
  date: string;

  @Prop()
  tgId: string;

  @Prop()
  lastUpdated: string;

  @Prop()
  movieCount: number;

  @Prop()
  photoCount: number;

  @Prop()
  videoCount: number;

  @Prop({ required: false })
  gender: string | null;

  @Prop({ required: false })
  username: string | null;

  @Prop()
  otherPhotoCount: number;

  @Prop()
  otherVideoCount: number;

  @Prop()
  ownPhotoCount: number;

  @Prop()
  ownVideoCount: number;

  @Prop()
  contacts: number;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {
      outgoing: 0,
      incoming: 0,
      video: 0,
      chatCallCounts: [],
      totalCalls: 0,
    },
  })
  calls: {
    outgoing: number;
    incoming: number;
    video: number;
    chatCallCounts: any[];
    totalCalls: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
