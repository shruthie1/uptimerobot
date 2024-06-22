import { Controller, Get, Post, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { TelegramService } from './Telegram.service';

@Controller('telegram')
@ApiTags('Telegram')
export class TelegramController {
    constructor(
        private readonly telegramService: TelegramService
    ) { }

    async connectToTelegram(mobile: string) {
        return await this.telegramService.createClient(mobile);
    }

    @Get('connect/:mobile')
    @ApiOperation({ summary: 'Create and connect a new Telegram client' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 201, description: 'Client connected successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async connectClient(@Param('mobile') mobile: string): Promise<string> {
        await this.connectToTelegram(mobile);
        return 'Client connected successfully';
    }

    @Get('messages/:mobile')
    @ApiOperation({ summary: 'Get messages from Telegram' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'username', description: 'Username to fetch messages from', required: true })
    @ApiQuery({ name: 'limit', description: 'Limit the number of messages', required: false })
    //@apiresponse({ status: 200, description: 'Messages fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getMessages(@Param('mobile') mobile: string, @Query('username') username: string, @Query('limit') limit: number = 8) {
        await this.connectToTelegram(mobile);
        return this.telegramService.getMessages(mobile, username, limit);
    }

    @Get('chatid/:mobile')
    @ApiOperation({ summary: 'Get chat ID for a username' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'username', description: 'Username to fetch chat ID for', required: true })
    //@apiresponse({ status: 200, description: 'Chat ID fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getChatId(@Param('mobile') mobile: string, @Query('username') username: string) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.getChatId(mobile, username);
    }

    @Post('joinchannels/:mobile')
    @ApiOperation({ summary: 'Join channels' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiBody({ description: 'Channels string', schema: { type: 'object', properties: { channels: { type: 'string' } } } })
    //@apiresponse({ status: 200, description: 'Channels joined successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async joinChannels(@Param('mobile') mobile: string, @Body('channels') channels: string) {
        await this.connectToTelegram(mobile);
        this.telegramService.joinChannels(mobile, channels);
        return 'Channels joined successfully';
    }

    @Get('removeauths/:mobile')
    @ApiOperation({ summary: 'Remove other authorizations' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Authorizations removed successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async removeOtherAuths(@Param('mobile') mobile: string) {
        await this.connectToTelegram(mobile);
        await this.telegramService.removeOtherAuths(mobile);
        return 'Authorizations removed successfully';
    }

    @Get('selfmsgsinfo/:mobile')
    @ApiOperation({ summary: 'Get self messages info' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Self messages info fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getSelfMsgsInfo(@Param('mobile') mobile: string) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.getSelfMsgsInfo(mobile);
    }

    @Get('channelinfo/:mobile')
    @ApiOperation({ summary: 'Get channel info' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    @ApiQuery({ name: 'sendIds', description: 'Whether to send IDs or not', required: false })
    //@apiresponse({ status: 200, description: 'Channel info fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getChannelInfo(@Param('mobile') mobile: string, @Query('sendIds') sendIds: boolean = false) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.getChannelInfo(mobile, sendIds);
    }

    @Get('auths/:mobile')
    @ApiOperation({ summary: 'Get authorizations' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Authorizations fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getAuths(@Param('mobile') mobile: string) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.getAuths(mobile);
    }

    @Get('set2Fa/:mobile')
    @ApiOperation({ summary: 'Set 2Fa' })
    @ApiParam({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: '2Fa set successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    async set2Fa(@Param('mobile') mobile: string) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.set2Fa(mobile);
    }

    @Get('setprofilepic/:mobile/:name')
    @ApiOperation({ summary: 'Set Profile Picture' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiParam({ name: 'name', description: 'Profile name', type: String })
    async setProfilePic(
        @Param('mobile') mobile: string,
        @Param('name') name: string,
    ) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.setProfilePic(mobile, name)
    }

    @Get('SetAsBufferClient/:mobile')
    @ApiOperation({ summary: 'Set as Buffer Client' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    async setAsBufferClient(
        @Param('mobile') mobile: string,
    ) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.setAsBufferClient(mobile);
    }

    @Get('updatePrivacy/:mobile')
    @ApiOperation({ summary: 'Update Privacy Settings' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    async updatePrivacy(
        @Param('mobile') mobile: string,
    ) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.updatePrivacy(mobile)
    }

    @Get('UpdateUsername/:mobile')
    @ApiOperation({ summary: 'Update Username' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiQuery({ name: 'username', description: 'New username', type: String })
    async updateUsername(
        @Param('mobile') mobile: string,
        @Query('username') username: string,
    ) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.updateUsername(mobile, username)
    }

    @Get('updateNameandBio/:mobile')
    @ApiOperation({ summary: 'Update Name' })
    @ApiParam({ name: 'mobile', description: 'User mobile number', type: String })
    @ApiQuery({ name: 'firstName', description: 'First Name', type: String })
    @ApiQuery({ name: 'about', description: 'About', type: String })
    async updateName(
        @Param('mobile') mobile: string,
        @Query('firstName') firstName: string,
        @Query('about') about: string,
    ) {
        await this.connectToTelegram(mobile);
        return await this.telegramService.updateNameandBio(mobile, firstName, about)
    }

}
