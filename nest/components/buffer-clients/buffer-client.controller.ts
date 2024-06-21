import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BufferClientService } from './buffer-client.service';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import {BufferClient } from './schemas/buffer-client.schema';
import { SearchBufferClientDto } from './dto/search-buffer- client.dto';

@ApiTags('Buffer Clients')
@Controller('bufferclients')
export class BufferClientController {
  constructor(private readonly clientService: BufferClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create user data' })
  @ApiResponse({ status: 201, description: 'The user data has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createClientDto: CreateBufferClientDto): Promise<BufferClient> {
    return this.clientService.create(createClientDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user data' })
  @ApiResponse({ status: 200, description: 'Return the searched user data.' })
  async search(@Query() query: SearchBufferClientDto): Promise<BufferClient[]> {
    return this.clientService.search(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  @ApiResponse({ status: 200, description: 'Return all user data.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(): Promise<BufferClient[]> {
    return this.clientService.findAll();
  }

  @Get(':bufferClientId')
  @ApiOperation({ summary: 'Get user data by ID' })
  @ApiResponse({ status: 200, description: 'Return the user data.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async findOne(@Param('bufferClientId') bufferClientId: string): Promise<BufferClient> {
    return this.clientService.findOne(bufferClientId);
  }

  @Patch(':bufferClientId')
  @ApiOperation({ summary: 'Update user data by ID' })
  @ApiResponse({ status: 200, description: 'The user data has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async update(@Param('bufferClientId') bufferClientId: string, @Body() updateClientDto: Partial<BufferClient>): Promise<BufferClient> {
    return this.clientService.update(bufferClientId, updateClientDto);
  }

  @Delete(':bufferClientId')
  @ApiOperation({ summary: 'Delete user data by ID' })
  @ApiResponse({ status: 200, description: 'The user data has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User data not found.' })
  async remove(@Param('bufferClientId') bufferClientId: string): Promise<BufferClient> {
    return this.clientService.remove(bufferClientId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a custom MongoDB query' })
  @ApiResponse({ status: 200, description: 'Query executed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async executeQuery(@Body() query: any): Promise<any> {
    try {
      return await this.clientService.executeQuery(query);
    } catch (error) {
      throw error;  // You might want to handle errors more gracefully
    }
  }
}
