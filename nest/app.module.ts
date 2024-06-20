import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './components/users/users.module';
import { UserDataModule } from './components/user-data/user-data.module';
import { ClientModule } from './components/clients/client.module';

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
  ],
})
export class AppModule { }
