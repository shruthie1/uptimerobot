import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BufferClient, BufferClientSchema } from './schemas/buffer-client.schema';
import { BufferClientService } from './buffer-client.service';
import { BufferClientController } from './buffer-client.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: BufferClient.name, schema: BufferClientSchema }])],
  controllers: [BufferClientController],
  providers: [BufferClientService],
})
export class BufferClientModule {}
