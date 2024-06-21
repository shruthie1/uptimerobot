import { BufferClientService } from './../buffer-clients/buffer-client.service';
import { Controller, Get, Post, Body, Param, Query, BadRequestException, Inject, forwardRef, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../users/users.service'; // Adjust the import path accordingly
import TelegramConnectionManager from './TelegramConnectionManager';
import { parseError, sleep } from '../../../utils';
import { CloudinaryService } from '../../../cloudinary';

@Controller('telegram')
@ApiTags('Telegram')
export class TelegramController {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => UsersService))
        private bufferClientService: BufferClientService
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
        telegramManager.joinChannels(channels);
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

    @Get('set2Fa/:mobile')
    @ApiOperation({ summary: 'Set 2Fa' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiResponse({ status: 200, description: '2Fa set successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async set2Fa(@Param('mobile') mobile: string) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await telegramManager.set2fa();
            await telegramManager.disconnect();
            return '2Fa set successfully'
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    @Get('setprofilepic/:mobile/:name')
    @ApiOperation({ summary: 'Set Profile Picture' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiParam({ name: 'name', description: 'Profile name', type: String })
    async setProfilePic(
        @Param('mobile') mobile: string,
        @Param('name') name: string,
    ) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await CloudinaryService.getInstance(name);
            await sleep(2000);
            await telegramManager.updateProfilePic('./dp1.jpg');
            await sleep(1000);
            await telegramManager.updateProfilePic('./dp2.jpg');
            await sleep(1000);
            await telegramManager.updateProfilePic('./dp3.jpg');
            await sleep(1000);
            await telegramManager.disconnect();
            return '2Fa set successfully'
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    @Get('SetAsBufferClient/:mobile')
    @ApiOperation({ summary: 'Set as Buffer Client' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    async setAsBufferClient(
        @Param('mobile') mobile: string,
    ) {
        const user = this.usersService.search({mobile})[0];
        if (!user) {
            throw new BadRequestException('user not found');
        }
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await telegramManager.set2fa();
            await sleep(30000)
            await telegramManager.updateUsername('');
            await sleep(5000)
            await telegramManager.updatePrivacyforDeletedAccount();
            await sleep(5000)
            await telegramManager.updateProfile("Deleted Account", "Deleted Account");
            await sleep(5000)
            await telegramManager.deleteProfilePhotos();
            await sleep(5000);
            await this.bufferClientService.create(user)
            return "Client set as buffer successfully";
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    @Get('updatePrivacy/:mobile')
    @ApiOperation({ summary: 'Update Privacy Settings' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    async updatePrivacy(
        @Param('mobile') mobile: string,
    ) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await telegramManager.updatePrivacy()
            return "Privacy updated successfully";
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    @Get('UpdateUsername/:mobile')
    @ApiOperation({ summary: 'Update Username' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiQuery({ name: 'username', description: 'New username', type: String })
    async updateUsername(
        @Param('mobile') mobile: string,
        @Query('username') username: string,
    ) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await telegramManager.updateUsername(username)
            return "Username updated successfully";
        } catch (error) {
            console.log("Some Error: ", parseError(error), error);
            throw new Error("Failed to update username");
        }
    }

    @Get('UpdateName/:mobile')
    @ApiOperation({ summary: 'Update Name' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiQuery({ name: 'firstName', description: 'First Name', type: String })
    @ApiQuery({ name: 'about', description: 'About', type: String })
    async updateName(
        @Param('mobile') mobile: string,
        @Query('firstName') firstName: string,
        @Query('about') about: string,
    ) {
        const telegramManager = await TelegramConnectionManager.getInstance(this.usersService).createClient(mobile)
        try {
            await telegramManager.updateProfile(firstName, about)
            return "Username updated successfully";
        } catch (error) {
            console.log("Some Error: ", parseError(error), error);
            throw new Error("Failed to update username");
        }
    }

}
