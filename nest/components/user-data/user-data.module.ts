import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserData, UserDataSchema } from './schemas/user-data.schema';
import { UserDataService } from './user-data.service';
import { UserDataController } from './user-data.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserData.name, schema: UserDataSchema }])],
  controllers: [UserDataController],
  providers: [UserDataService],
})
export class UserDataModule {}
