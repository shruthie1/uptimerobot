import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Telegram Users') // Tag to categorize all endpoints in this controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

 
  @ApiOperation({ summary: 'Search users based on various parameters' })
  @Get('/search')
  @ApiQuery({ name: 'tgId', required: false, type: String, description: 'Filter by Telegram ID' })
  @ApiQuery({ name: 'mobile', required: false, type: String, description: 'Filter by mobile number' })
  @ApiQuery({ name: 'session', required: false, type: String, description: 'Filter by session' })
  @ApiQuery({ name: 'firstName', required: false, type: String, description: 'Filter by first name' })
  @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Filter by last name' })
  @ApiQuery({ name: 'userName', required: false, type: String, description: 'Filter by username' })
  @ApiQuery({ name: 'channels', required: false, type: Number, description: 'Filter by channels count' })
  @ApiQuery({ name: 'personalChats', required: false, type: Number, description: 'Filter by personal chats count' })
  @ApiQuery({ name: 'demoGiven', required: false, type: Boolean, description: 'Filter by demo given status' })
  @ApiQuery({ name: 'msgs', required: false, type: Number, description: 'Filter by messages count' })
  @ApiQuery({ name: 'totalChats', required: false, type: Number, description: 'Filter by total chats count' })
  @ApiQuery({ name: 'lastActive', required: false, type: Number, description: 'Filter by last active timestamp' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Filter by date' })
  @ApiQuery({ name: 'lastUpdated', required: false, type: String, description: 'Filter by last updated timestamp' })
  @ApiQuery({ name: 'movieCount', required: false, type: Number, description: 'Filter by movie count' })
  @ApiQuery({ name: 'photoCount', required: false, type: Number, description: 'Filter by photo count' })
  @ApiQuery({ name: 'videoCount', required: false, type: Number, description: 'Filter by video count' })
  @ApiQuery({ name: 'gender', required: false, type: String, description: 'Filter by gender' })
  @ApiQuery({ name: 'username', required: false, type: String, description: 'Filter by username' })
  @ApiQuery({ name: 'otherPhotoCount', required: false, type: Number, description: 'Filter by other photo count' })
  @ApiQuery({ name: 'otherVideoCount', required: false, type: Number, description: 'Filter by other video count' })
  @ApiQuery({ name: 'ownPhotoCount', required: false, type: Number, description: 'Filter by own photo count' })
  @ApiQuery({ name: 'ownVideoCount', required: false, type: Number, description: 'Filter by own video count' })
  @ApiQuery({ name: 'contacts', required: false, type: Number, description: 'Filter by contacts count' })
  @ApiQuery({ name: 'calls.outgoing', required: false, type: Number, description: 'Filter by outgoing call count' })
  @ApiQuery({ name: 'calls.incoming', required: false, type: Number, description: 'Filter by incoming call count' })
  @ApiQuery({ name: 'calls.video', required: false, type: Number, description: 'Filter by video call count' })
  @ApiQuery({ name: 'calls.chatCallCounts', required: false, type: [String], description: 'Filter by chat call counts' })
  @ApiQuery({ name: 'calls.totalCalls', required: false, type: Number, description: 'Filter by total call count' })
  async search(@Query() queryParams: Partial<User>) {
    return this.usersService.search(queryParams);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by tgId' })
  @ApiParam({ name: 'tgId', description: 'The Telegram ID of the user', type: String })
  @Get(':tgId')
  async findOne(@Param('tgId') tgId: string) {
    return this.usersService.findOne(tgId);
  }

  @ApiOperation({ summary: 'Update a user by tgId' })
  @ApiParam({ name: 'tgId', description: 'The Telegram ID of the user', type: String })
  @Patch(':tgId')
  async update(@Param('tgId') tgId: string, @Body() updateUserDto: Partial<User>) {
    return this.usersService.update(tgId, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by tgId' })
  @ApiParam({ name: 'tgId', description: 'The Telegram ID of the user', type: String })
  @Delete(':tgId')
  async remove(@Param('tgId') tgId: string) {
    return this.usersService.delete(tgId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a custom MongoDB query' })
  //@apiresponse({ status: 200, description: 'Query executed successfully.' })
  //@apiresponse({ status: 400, description: 'Invalid query.' })
  //@apiresponse({ status: 500, description: 'Internal server error.' })
  async executeQuery(@Body() query: any): Promise<any> {
    try {
      return await this.usersService.executeQuery(query);
    } catch (error) {
      throw error;  // You might want to handle errors more gracefully
    }
  }

}
