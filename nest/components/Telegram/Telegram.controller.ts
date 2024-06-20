import { Controller, Get, Post, Body, Param, Query, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../users/users.service'; // Adjust the import path accordingly
import TelegramConnectionManager from './TelegramConnectionManager';

@Controller('telegram')
@ApiTags('Telegram')
export class TelegramController {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) { }

    @Get('connect/:mobile')
    @ApiOperation({ summary: 'Create and connect a new Telegram client' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 201, description: 'Client connected successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async connectClient(@Param('mobile') mobile: string): Promise<string> {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        if (!telegramManager) {
            throw new BadRequestException('Failed to connect the client');
        }
        return 'Client connected successfully';
    }

    @Get('messages/:mobile')
    @ApiOperation({ summary: 'Get messages from Telegram' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'username', description: 'Username to fetch messages from', required: true })
    @ApiQuery({ name: 'limit', description: 'Limit the number of messages', required: false })
    @ApiResponse({ status: 200, description: 'Messages fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getMessages(@Param('mobile') mobile: string, @Query('username') username: string, @Query('limit') limit: number = 8) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return telegramManager.getMessages(username, limit);
    }

    @Get('dialogs/:mobile')
    @ApiOperation({ summary: 'Get all dialogs from Telegram' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: 'Dialogs fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getDialogs(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getDialogs();
    }

    @Get('chatid/:mobile')
    @ApiOperation({ summary: 'Get chat ID for a username' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'username', description: 'Username to fetch chat ID for', required: true })
    @ApiResponse({ status: 200, description: 'Chat ID fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getChatId(@Param('mobile') mobile: string, @Query('username') username: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getchatId(username);
    }

    @Post('joinchannels/:mobile')
    @ApiOperation({ summary: 'Join channels' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiBody({ description: 'Channels string', schema: { type: 'object', properties: { channels: { type: 'string' } } } })
    @ApiResponse({ status: 200, description: 'Channels joined successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async joinChannels(@Param('mobile') mobile: string, @Body('channels') channels: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        await telegramManager.joinChannels(channels);
        return 'Channels joined successfully';
    }

    @Get('removeauths/:mobile')
    @ApiOperation({ summary: 'Remove other authorizations' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: 'Authorizations removed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async removeOtherAuths(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        await telegramManager.removeOtherAuths();
        return 'Authorizations removed successfully';
    }


    @Get('lastmsgs/:mobile')
    @ApiOperation({ summary: 'Get the last messages from a specific chat' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'limit', description: 'Limit the number of messages', required: true })
    @ApiResponse({ status: 200, description: 'Messages fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getLastMsgs(@Param('mobile') mobile: string, @Query('limit') limit: number) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getLastMsgs(limit);
    }

    @Get('selfmsgsinfo/:mobile')
    @ApiOperation({ summary: 'Get self messages info' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: 'Self messages info fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getSelfMsgsInfo(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getSelfMSgsInfo();
    }

    @Get('channelinfo/:mobile')
    @ApiOperation({ summary: 'Get channel info' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'sendIds', description: 'Whether to send IDs or not', required: false })
    @ApiResponse({ status: 200, description: 'Channel info fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getChannelInfo(@Param('mobile') mobile: string, @Query('sendIds') sendIds: boolean = false) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.channelInfo(sendIds);
    }

    @Get('auths/:mobile')
    @ApiOperation({ summary: 'Get authorizations' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: 'Authorizations fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getAuths(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getAuths();
    }

    @Get('allchats/:mobile')
    @ApiOperation({ summary: 'Get all chats' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: 'All chats fetched successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getAllChats(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        return await telegramManager.getAllChats();
    }
}
