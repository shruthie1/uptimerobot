import { UsersService } from './../users/users.service';
import { parseError } from "../../../utils";
import  TelegramManager from "./Telegram.service";
import { BadRequestException } from '@nestjs/common';

class TelegramConnectionManager {
    private static instance: TelegramConnectionManager;
    private clients: Map<string, TelegramManager>
    private static activeClientSetup;
    private usersService: UsersService

    private constructor(usersService: UsersService) {
        this.clients = new Map();
        this.usersService= usersService
    }

    static getInstance(usersService:UsersService) {
        if (!TelegramConnectionManager.instance) {
            TelegramConnectionManager.instance = new TelegramConnectionManager(usersService)
        }
        return TelegramConnectionManager.instance
    }

    public getActiveClientSetup() {
        return TelegramConnectionManager.activeClientSetup;
    }

    public setActiveClientSetup(data) {
        TelegramConnectionManager.activeClientSetup = data;
    }

    public getClient(number: string) {
        return this.clients.get(number);
    }

    public hasClient(number: string) {
        return this.clients.has(number);
    }

    async deleteClient(number: string) {
        const cli = this.getClient(number);
        await cli?.disconnect();
        return this.clients.delete(number);
    }

    async disconnectAll() {
        const data = this.clients.entries();
        console.log("Disconnecting All Clients");
        for (const [phoneNumber, client] of data) {
            try {
                await client?.disconnect();
                this.clients.delete(phoneNumber);
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
        if (!this.clients.has(mobile)) {
            return new Promise(async (resolve) => {
                const telegramManager= new TelegramManager(user.session, user.mobile);
                const client = await telegramManager.createClient(handler);
                if (client) {
                    this.clients.set(mobile, telegramManager);
                    if (autoDisconnect) {
                        setTimeout(async () => {
                            if (client.connected || this.clients.get(mobile)) {
                                console.log("SELF destroy client");
                                await telegramManager.disconnect();
                            } else {
                                console.log("Client Already Disconnected");
                            }
                            this.clients.delete(mobile);
                        }, 180000)
                    } else {
                        setInterval(async () => {
                            await client.connect();
                        }, 20000);
                    }
                    resolve(telegramManager);
                }else{
                    await this.usersService.delete(user.tgId);
                    throw new BadRequestException('Client Expired');
                    resolve(undefined)
                }
            });
        } else {
            return this.clients.get(mobile)
        }
    }
}

export default TelegramConnectionManager;
