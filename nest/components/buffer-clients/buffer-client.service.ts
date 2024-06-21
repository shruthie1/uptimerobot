import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferClient, BufferClientDocument } from './schemas/buffer-client.schema';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';

@Injectable()
export class BufferClientService {
    private clientsMap: Map<string, BufferClient> = new Map();
    constructor(@InjectModel(BufferClient.name) private clientModel: Model<BufferClientDocument>) { }

    async create(createClientDto: CreateBufferClientDto): Promise<BufferClient> {
        const createdUser = new this.clientModel(createClientDto);
        return createdUser.save();
    }

    async findAll(): Promise<BufferClient[]> {
        if (this.clientsMap.size < 3) {
            const results: BufferClient[] = await this.clientModel.find().exec();
            for (const client of results) {
                this.clientsMap.set(client.clientId, client)
            }
            return results
        } else {
            return Array.from(this.clientsMap.values())
        }
    }

    async findOne(bufferClientId: string): Promise<BufferClient> {
        const client = this.clientsMap.get(bufferClientId)
        if (client) {
            return client;
        } else {
            const user = await this.clientModel.findOne({ bufferClientId }).exec();
            this.clientsMap.set(bufferClientId, user);
            if (!user) {
                throw new NotFoundException(`Client with ID "${bufferClientId}" not found`);
            }
            return user;
        }
    }

    async update(bufferClientId: string, updateClientDto: Partial<BufferClient>): Promise<BufferClient> {
        delete updateClientDto['_id']
        const updatedUser = await this.clientModel.findOneAndUpdate({ bufferClientId }, { $set: updateClientDto }, { new: true }).exec();
        this.clientsMap.set(bufferClientId, updatedUser);
        if (!updatedUser) {
            throw new NotFoundException(`Client with ID "${bufferClientId}" not found`);
        }
        return updatedUser;
    }

    async remove(bufferClientId: string): Promise<BufferClient> {
        const deletedUser = await this.clientModel.findOneAndDelete({ bufferClientId }).exec();
        if (!deletedUser) {
            throw new NotFoundException(`Client with ID "${bufferClientId}" not found`);
        }
        return deletedUser;
    }

    async search(filter: any): Promise<BufferClient[]> {
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
