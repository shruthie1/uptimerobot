import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './components/users/users.module';
import { UserDataModule } from './components/user-data/user-data.module';
import { ClientModule } from './components/clients/client.module';
import { TelegramModule } from './components/Telegram/Telegram.module';

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
    TelegramModule
  ],
})
export class AppModule { }
