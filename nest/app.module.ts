import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './components/users/users.module';
import { UserDataModule } from './components/user-data/user-data.module';
import { ClientModule } from './components/clients/client.module';
import { TelegramModule } from './components/Telegram/Telegram.module';
import { BufferClientModule } from './components/buffer-clients/buffer-client.module';
import { ActiveChannelsModule } from './components/activechannels/activechannels.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.mongouri,
      }),
    }),
    ClientModule,
    UserDataModule,
    UsersModule,
    TelegramModule,
    BufferClientModule,
    ActiveChannelsModule
  ],
})
export class AppModule { }
