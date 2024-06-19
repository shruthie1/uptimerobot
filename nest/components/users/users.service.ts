import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

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
    const existingUser = await this.userModel.findOneAndUpdate({ tgId }, user, { new: true }).exec();
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
  async search(filter: any): Promise<User[]> {
    console.log(filter)
    if (filter.firstName) {
      filter.firstName = { $regex: new RegExp(filter.firstName,'i') }
    }
    console.log(filter)
    return this.userModel.find(filter).exec();
  }
}
