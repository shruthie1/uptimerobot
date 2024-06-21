import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('userModule') private userModel: Model<User>) { }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(tgId: string): Promise<User> {
    const user = await this.userModel.findOne({ tgId }).exec();
    if (!user) {
      throw new NotFoundException(`User with tgId ${tgId} not found`);
    }
    return user;
  }

  async update(tgId: string, user: Partial<User>): Promise<User> {
    delete user['_id']
    const existingUser = await this.userModel.findOneAndUpdate({ tgId }, { $set: user }, { new: true }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with tgId ${tgId} not found`);
    }
    return existingUser;
  }

  async delete(tgId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ tgId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with tgId ${tgId} not found`);
    }
  }
  async search(filter: SearchUserDto): Promise<User[]> {
    if (filter.firstName) {
      filter.firstName = { $regex: new RegExp(filter.firstName,'i') } as any
    }
    if (filter.twoFA !== undefined) {
      filter.twoFA = filter.twoFA as any === 'true' || filter.twoFA as any === '1' || filter.twoFA === true;
    }
    console.log(filter)
    return this.userModel.find(filter).exec();
  }

  async executeQuery(query: any): Promise<any> {
    try {
      if (!query) {
        throw new BadRequestException('Query is invalid.');
      }
      return await this.userModel.find(query).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
