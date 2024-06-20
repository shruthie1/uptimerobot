// src/activechannels/activechannels.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateActiveChannelDto } from './dto/create-active-channel.dto';
import { UpdateActiveChannelDto } from './dto/update-active-channel.dto';
import { ActiveChannel } from './schemas/active-channel.schema';

@Injectable()
export class ActiveChannelsService {
  constructor(
    @InjectModel(ActiveChannel.name) private activeChannelModel: Model<ActiveChannel>,
  ) { }

  async create(createActiveChannelDto: CreateActiveChannelDto): Promise<ActiveChannel> {
    const createdChannel = new this.activeChannelModel(createActiveChannelDto);
    return createdChannel.save();
  }

  async findAll(): Promise<ActiveChannel[]> {
    return this.activeChannelModel.find().exec();
  }

  async findOne(channelId: string): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOne({ channelId }).exec();
    return channel;
  }

  async update(channelId: string, updateActiveChannelDto: UpdateActiveChannelDto): Promise<ActiveChannel> {
    const updatedChannel = await this.activeChannelModel.findOneAndUpdate(
      { channelId },
      updateActiveChannelDto,
      { new: true },
    ).exec();
    return updatedChannel;
  }

  async remove(channelId: string): Promise<void> {
    const result = await this.activeChannelModel.findOneAndDelete({ channelId }).exec();
  }

  async search(filter: any): Promise<ActiveChannel[]> {
    console.log(filter)
    return this.activeChannelModel.find(filter).exec();
  }

  async addReactions(channelId: string, reactions: string[]): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOneAndUpdate({ channelId }, {
      $addToSet: { availableMsgs: reactions }
    })
    return channel;
  }

  async getRandomReaction(channelId: string): Promise<string> {
    const channel = await this.activeChannelModel.findOne({ channelId }).exec();
    if (!channel) {
      return undefined;
    }
    if (channel.reactions.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * channel.reactions.length);
    return channel.reactions[randomIndex];
  }

  async removeReaction(channelId: string, reaction: string): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOneAndUpdate({ channelId }, {
      $pull: { reactions: reaction }
    })
    return channel;
  }
}
