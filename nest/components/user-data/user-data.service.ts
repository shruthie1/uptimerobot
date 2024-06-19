import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData, UserDataDocument } from './schemas/user-data.schema';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Injectable()
export class UserDataService {
    constructor(@InjectModel(UserData.name) private userModel: Model<UserDataDocument>) { }

    async create(createUserDataDto: CreateUserDataDto): Promise<UserData> {
        const createdUser = new this.userModel(createUserDataDto);
        return createdUser.save();
    }

    async findAll(): Promise<UserData[]> {
        return this.userModel.find().exec();
    }

    async findOne(chatId: string): Promise<UserData> {
        const user = await this.userModel.findOne({chatId}).exec();
        if (!user) {
            throw new NotFoundException(`UserData with ID "${chatId}" not found`);
        }
        return user;
    }

    async update(chatId: string, updateUserDataDto: Partial<UserData>): Promise<UserData> {
        const updatedUser = await this.userModel.findOneAndUpdate({chatId}, { $set: updateUserDataDto }, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException(`UserData with ID "${chatId}" not found`);
        }
        return updatedUser;
    }

    async remove(chatId: string): Promise<UserData> {
        const deletedUser = await this.userModel.findOneAndDelete({chatId}).exec();
        if (!deletedUser) {
            throw new NotFoundException(`UserData with ID "${chatId}" not found`);
        }
        return deletedUser;
    }

    async search(filter: any): Promise<UserData[]> {
        console.log(filter)
        if (filter.firstName) {
            filter.firstName = { $regex: new RegExp(filter.firstName, 'i') }
        }
        console.log(filter)
        return this.userModel.find(filter).exec();
    }
}
