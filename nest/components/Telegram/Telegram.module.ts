import { Module } from '@nestjs/common';
import { TelegramController } from './Telegram.controller';
import { UsersModule } from '../users/users.module';
import { BufferClientModule } from '../buffer-clients/buffer-client.module';
import { TelegramService } from './Telegram.service';

@Module({
    imports: [UsersModule, BufferClientModule],
    controllers: [TelegramController],
    providers: [TelegramService]
})
export class TelegramModule { }
