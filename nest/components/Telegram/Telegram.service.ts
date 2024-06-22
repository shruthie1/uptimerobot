import { BufferClientService } from './../buffer-clients/buffer-client.service';
import { UsersService } from '../users/users.service';
import { contains, parseError, sleep } from "../../../utils";
import TelegramManager from "./TelegramManager";
import { BadRequestException, HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CloudinaryService } from '../../../cloudinary';

@Injectable()
export class TelegramService {
    private static clientsMap: Map<string, TelegramManager> = new Map()
    private static activeClientSetup;

    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => BufferClientService))
        private bufferClientService: BufferClientService
    ) { }


    public getActiveClientSetup() {
        return TelegramService.activeClientSetup;
    }

    public setActiveClientSetup(data) {
        TelegramService.activeClientSetup = data;
    }

    public getClient(number: string) {
        return TelegramService.clientsMap.get(number);
    }

    public hasClient(number: string) {
        return TelegramService.clientsMap.has(number);
    }

    async deleteClient(number: string) {
        const cli = this.getClient(number);
        await cli?.disconnect();
        return TelegramService.clientsMap.delete(number);
    }

    async disconnectAll() {
        const data = TelegramService.clientsMap.entries();
        console.log("Disconnecting All Clients");
        for (const [phoneNumber, client] of data) {
            try {
                await client?.disconnect();
                TelegramService.clientsMap.delete(phoneNumber);
                console.log(`Client disconnected: ${phoneNumber}`);
            } catch (error) {
                console.log(parseError(error));
                console.log(`Failed to Disconnect : ${phoneNumber}`);
            }
        }
    }

    async createClient(mobile: string, autoDisconnect = true, handler = true): Promise<TelegramManager> {
        const user = (await this.usersService.search({ mobile }))[0];
        if (!user) {
            throw new BadRequestException('user not found');
        }
        if (!TelegramService.clientsMap.has(mobile)) {
            const telegramManager = new TelegramManager(user.session, user.mobile);
            try {
                const client = await telegramManager.createClient(handler);
                if (client) {
                    TelegramService.clientsMap.set(mobile, telegramManager);
                    if (autoDisconnect) {
                        setTimeout(async () => {
                            if (client.connected || TelegramService.clientsMap.get(mobile)) {
                                console.log("SELF destroy client");
                                await telegramManager.disconnect();
                            } else {
                                console.log("Client Already Disconnected");
                            }
                            TelegramService.clientsMap.delete(mobile);
                        }, 180000)
                    } else {
                        setInterval(async () => {
                            await client.connect();
                        }, 20000);
                    }
                    return telegramManager;
                } else {
                    throw new BadRequestException('Client Expired');
                }
            } catch (error) {
                console.log("Parsing Error");
                const errorDetails = parseError(error);
                if (contains(errorDetails.message.toLowerCase(), ['expired', 'unregistered', 'deactivated'])) {
                    console.log("Deleting User: ", user.mobile);
                    await this.usersService.delete(user.tgId);
                } else {
                    console.log('Not Deleting user');
                }
                throw new BadRequestException(errorDetails.message)
            }
        } else {
            return TelegramService.clientsMap.get(mobile)
        }
    }
    async getMessages(mobile: string, username: string, limit: number = 8) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        return telegramClient.getMessages(username, limit);
    }
    //@apiresponse({ status: 400, description: 'Bad request' })
    async getChatId(mobile: string, username: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        return await telegramClient.getchatId(username);
    }

    async joinChannels(mobile: string, channels: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        telegramClient.joinChannels(channels);
        return 'Channels joined successfully';
    }
    async removeOtherAuths(mobile: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        await telegramClient.removeOtherAuths();
        return 'Authorizations removed successfully';
    }

    //@apiresponse({ status: 400, description: 'Bad request' })
    async getSelfMsgsInfo(mobile: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        return await telegramClient.getSelfMSgsInfo();
    }

    async getChannelInfo(mobile: string, sendIds: boolean = false) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        return await telegramClient.channelInfo(sendIds);
    }

    async getAuths(mobile: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        return await telegramClient.getAuths();
    }

    async set2Fa(mobile: string) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await telegramClient.set2fa();
            await telegramClient.disconnect();
            return '2Fa set successfully'
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    async setProfilePic(
        mobile: string, name: string,
    ) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await CloudinaryService.getInstance(name);
            await sleep(2000);
            await telegramClient.updateProfilePic('./dp1.jpg');
            await sleep(1000);
            await telegramClient.updateProfilePic('./dp2.jpg');
            await sleep(1000);
            await telegramClient.updateProfilePic('./dp3.jpg');
            await sleep(1000);
            await telegramClient.disconnect();
            return '2Fa set successfully'
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    async setAsBufferClient(
        mobile: string,
    ) {
        const user = (await this.usersService.search({ mobile }))[0];
        if (!user) {
            throw new BadRequestException('user not found');
        }
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await telegramClient.set2fa();
            await sleep(30000)
            await telegramClient.updateUsername('');
            await sleep(5000)
            await telegramClient.updatePrivacyforDeletedAccount();
            await sleep(5000)
            await telegramClient.updateProfile("Deleted Account", "Deleted Account");
            await sleep(5000)
            await telegramClient.deleteProfilePhotos();
            await sleep(5000);
            await this.bufferClientService.create(user)
            return "Client set as buffer successfully";
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    async updatePrivacy(
        mobile: string,
    ) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await telegramClient.updatePrivacy()
            return "Privacy updated successfully";
        } catch (error) {
            const errorDetails = parseError(error)
            throw new HttpException(errorDetails.message, parseInt(errorDetails.status))
        }
    }

    async updateUsername(
        mobile: string, username: string,
    ) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await telegramClient.updateUsername(username)
            return "Username updated successfully";
        } catch (error) {
            console.log("Some Error: ", parseError(error), error);
            throw new Error("Failed to update username");
        }
    }

    async updateNameandBio(
        mobile: string,
        firstName: string,
        about: string,
    ) {
        const telegramClient = TelegramService.clientsMap.get(mobile)
        try {
            await telegramClient.updateProfile(firstName, about)
            return "Username updated successfully";
        } catch (error) {
            console.log("Some Error: ", parseError(error), error);
            throw new Error("Failed to update username");
        }
    }
}