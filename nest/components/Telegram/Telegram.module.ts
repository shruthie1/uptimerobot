import { Module } from '@nestjs/common';
import { TelegramController } from './Telegram.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports:[UsersModule],
    controllers: [TelegramController],
    // providers:[UsersService]
})
export class TelegramModule { }
