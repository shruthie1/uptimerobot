import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class BufferClientService {
    constructor(@InjectModel('bufferClientModule') private bufferClientModel: Model<User>) { }

    async create(bufferClient: CreateBufferClientDto): Promise<User> {
        const newUser = new this.bufferClientModel(bufferClient);
        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.bufferClientModel.find().exec();
    }

    async findOne(tgId: string): Promise<User> {
        const user = await this.bufferClientModel.findOne({ tgId }).exec();
        if (!user) {
            throw new NotFoundException(`User with tgId ${tgId} not found`);
        }
        return user;
    }

    async update(tgId: string, user: Partial<User>): Promise<User> {
        delete user['_id']
        const existingUser = await this.bufferClientModel.findOneAndUpdate({ tgId }, { $set: user }, { new: true }).exec();
        if (!existingUser) {
            throw new NotFoundException(`User with tgId ${tgId} not found`);
        }
        return existingUser;
    }

    async remove(tgId: string): Promise<void> {
        const result = await this.bufferClientModel.deleteOne({ tgId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`User with tgId ${tgId} not found`);
        }
    }
    async search(filter: any): Promise<User[]> {
        console.log(filter)
        if (filter.firstName) {
            filter.firstName = { $regex: new RegExp(filter.firstName, 'i') }
        }
        console.log(filter)
        return this.bufferClientModel.find(filter).exec();
    }

    async executeQuery(query: any): Promise<any> {
        try {
            if (!query) {
                throw new BadRequestException('Query is invalid.');
            }
            return await this.bufferClientModel.find(query).exec();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
