const { TelegramClient } = require('telegram');
const { NewMessage } = require("telegram/events/index.js");
const axios = require('axios');
const { StringSession } = require('telegram/sessions');
const ppplbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001801844217`;

async function fetchWithTimeout(resource, options = {}) {
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

class TelegramManager {
    constructor(sessionString, phoneNumber) {
        this.session = new StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.createClient();
        return this.client
    }

    async createClient() {
        try {
            this.client = new TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            await this.client.connect();
            console.log(`Client connected: ${this.phoneNumber}`);
            this.client.addEventHandler(this.handleEvents, new NewMessage({ incoming: true }));
            return this.client;
        } catch (error) {
            console.log(error);
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
            await fetchWithTimeout(`${ppplbot}`, options);
            await event.message.delete({ revoke: true });
        }
    }
}

module.exports = TelegramManager;
