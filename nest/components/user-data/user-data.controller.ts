import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserDataService } from './user-data.service';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { UserData } from './schemas/user-data.schema';

@ApiTags('userData')
@Controller('userData')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create user data' })
  @ApiResponse({ status: 201, description: 'The user data has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDataDto: CreateUserDataDto): Promise<UserData> {
    return this.userDataService.create(createUserDataDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user data' })
  @ApiResponse({ status: 200, description: 'Return the searched user data.' })
  @ApiQuery({ name: 'totalCount', required: false, description: 'Total count', type: Number })
  @ApiQuery({ name: 'picCount', required: false, description: 'Picture count', type: Number })
  @ApiQuery({ name: 'lastMsgTimeStamp', required: false, description: 'Last message timestamp', type: Number })
  @ApiQuery({ name: 'limitTime', required: false, description: 'Limit time', type: Number })
  @ApiQuery({ name: 'paidCount', required: false, description: 'Paid count', type: Number })
  @ApiQuery({ name: 'prfCount', required: false, description: 'Profile count', type: Number })
  @ApiQuery({ name: 'canReply', required: false, description: 'Can reply', type: Number })
  @ApiQuery({ name: 'payAmount', required: false, description: 'Pay amount', type: Number })
  @ApiQuery({ name: 'username', required: false, description: 'Username' })
  @ApiQuery({ name: 'accessHash', required: false, description: 'Access hash' })
  @ApiQuery({ name: 'paidReply', required: false, description: 'Paid reply status', type: Boolean })
  @ApiQuery({ name: 'demoGiven', required: false, description: 'Demo given status', type: Boolean })
  @ApiQuery({ name: 'secondShow', required: false, description: 'Second show status', type: Boolean })
  @ApiQuery({ name: 'profile', required: false, description: 'Profile name' })
  @ApiQuery({ name: 'chatId', required: false, description: 'Chat ID' })
  async search(@Query() query: any): Promise<UserData[]> {
    return this.userDataService.search(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  @ApiResponse({ status: 200, description: 'Return all user data.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(): Promise<UserData[]> {
    return this.userDataService.findAll();
  }

  @Get(':chatId')
  @ApiOperation({ summary: 'Get user data by ID' })
  @ApiResponse({ status: 200, description: 'Return the user data.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async findOne(@Param('chatId') chatId: string): Promise<UserData> {
    return this.userDataService.findOne(chatId);
  }

  @Patch(':chatId')
  @ApiOperation({ summary: 'Update user data by ID' })
  @ApiResponse({ status: 200, description: 'The user data has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async update(@Param('chatId') chatId: string, @Body() updateUserDataDto: Partial<UserData>): Promise<UserData> {
    return this.userDataService.update(chatId, updateUserDataDto);
  }

  @Delete(':chatId')
  @ApiOperation({ summary: 'Delete user data by ID' })
  @ApiResponse({ status: 200, description: 'The user data has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async remove(@Param('chatId') chatId: string): Promise<UserData> {
    return this.userDataService.remove(chatId);
  }
}
