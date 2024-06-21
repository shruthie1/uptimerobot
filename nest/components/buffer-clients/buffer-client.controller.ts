import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BufferClientService } from './buffer-client.service';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import { SearchBufferClientDto } from './dto/search-buffer- client.dto';
import { User } from '../users/schemas/user.schema';

@ApiTags('Buffer Clients')
@Controller('bufferclients')
export class BufferClientController {
  constructor(private readonly clientService: BufferClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create user data' })
  async create(@Body() createClientDto: CreateBufferClientDto): Promise<User> {
    return this.clientService.create(createClientDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user data' })
  async search(@Query() query: SearchBufferClientDto): Promise<User[]> {
    return this.clientService.search(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  async findAll(): Promise<User[]> {
    return this.clientService.findAll();
  }

  @Get(':bufferClientId')
  @ApiOperation({ summary: 'Get user data by ID' })
  async findOne(@Param('bufferClientId') bufferClientId: string): Promise<User> {
    return this.clientService.findOne(bufferClientId);
  }

  @Patch(':bufferClientId')
  @ApiOperation({ summary: 'Update user data by ID' })
  async update(@Param('bufferClientId') bufferClientId: string, @Body() updateClientDto: Partial<User>): Promise<User> {
    return this.clientService.update(bufferClientId, updateClientDto);
  }

  @Delete(':bufferClientId')
  @ApiOperation({ summary: 'Delete user data by ID' })
  async remove(@Param('bufferClientId') bufferClientId: string): Promise<void> {
    return this.clientService.remove(bufferClientId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a custom MongoDB query' })
  async executeQuery(@Body() query: any): Promise<any> {
    try {
      return await this.clientService.executeQuery(query);
    } catch (error) {
      throw error;  // You might want to handle errors more gracefully
    }
  }
}
