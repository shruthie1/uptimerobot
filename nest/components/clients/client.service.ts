import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
    private clientsMap: Map<string, Client> = new Map();
    constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>) { }

    async create(createClientDto: CreateClientDto): Promise<Client> {
        const createdUser = new this.clientModel(createClientDto);
        return createdUser.save();
    }

    async findAll(): Promise<Client[]> {
        if (this.clientsMap.size < 3) {
            const results: Client[] = await this.clientModel.find().exec();
            for (const client of results) {
                this.clientsMap.set(client.clientId, client)
            }
            return results
        } else {
            return Array.from(this.clientsMap.values())
        }
    }

    async findOne(clientId: string): Promise<Client> {
        const client = this.clientsMap.get(clientId)
        if (client) {
            return client;
        } else {
            const user = await this.clientModel.findOne({ clientId }).exec();
            this.clientsMap.set(clientId, user);
            if (!user) {
                throw new NotFoundException(`Client with ID "${clientId}" not found`);
            }
            return user;
        }
    }

    async update(clientId: string, updateClientDto: Partial<Client>): Promise<Client> {
        delete updateClientDto['_id']
        const updatedUser = await this.clientModel.findOneAndUpdate({ clientId }, { $set: updateClientDto }, { new: true }).exec();
        this.clientsMap.set(clientId, updatedUser);
        if (!updatedUser) {
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        return updatedUser;
    }

    async remove(clientId: string): Promise<Client> {
        const deletedUser = await this.clientModel.findOneAndDelete({ clientId }).exec();
        if (!deletedUser) {
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        return deletedUser;
    }

    async search(filter: any): Promise<Client[]> {
        console.log(filter)
        if (filter.firstName) {
            filter.firstName = { $regex: new RegExp(filter.firstName, 'i') }
        }
        console.log(filter)
        return this.clientModel.find(filter).exec();
    }

    async executeQuery(query: any): Promise<any> {
        try {
            if (!query) {
                throw new BadRequestException('Query is invalid.');
            }
            return await this.clientModel.find(query).exec();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
