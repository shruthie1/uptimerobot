import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BufferClientService } from './buffer-client.service';
import { BufferClientController } from './buffer-client.controller';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'bufferClientModule', schema: UserSchema, collection: 'bufferClients' }])],
  controllers: [BufferClientController],
  providers: [BufferClientService],
})
export class BufferClientModule {}
