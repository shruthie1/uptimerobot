import { Module } from '@nestjs/common';
import { TelegramController } from './Telegram.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { BufferClientModule } from '../buffer-clients/buffer-client.module';

@Module({
    imports:[UsersModule, BufferClientModule],
    controllers: [TelegramController],
    // providers:[UsersService]
})
export class TelegramModule { }
