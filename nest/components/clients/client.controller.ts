import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './schemas/client.schema';
import { SearchClientDto } from './dto/search-client.dto';

@ApiTags('Clients')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create user data' })
  //@apiresponse({ status: 201, description: 'The user data has been successfully created.' })
  //@apiresponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user data' })
  //@apiresponse({ status: 200, description: 'Return the searched user data.' })
  async search(@Query() query: SearchClientDto): Promise<Client[]> {
    return this.clientService.search(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user data' })
  //@apiresponse({ status: 200, description: 'Return all user data.' })
  //@apiresponse({ status: 403, description: 'Forbidden.' })
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':clientId')
  @ApiOperation({ summary: 'Get user data by ID' })
  //@apiresponse({ status: 200, description: 'Return the user data.' })
  //@apiresponse({ status: 404, description: 'User data not found.' })
  async findOne(@Param('clientId') clientId: string): Promise<Client> {
    return this.clientService.findOne(clientId);
  }

  @Patch(':clientId')
  @ApiOperation({ summary: 'Update user data by ID' })
  //@apiresponse({ status: 200, description: 'The user data has been successfully updated.' })
  //@apiresponse({ status: 404, description: 'User data not found.' })
  async update(@Param('clientId') clientId: string, @Body() updateClientDto: Partial<Client>): Promise<Client> {
    return this.clientService.update(clientId, updateClientDto);
  }

  @Delete(':clientId')
  @ApiOperation({ summary: 'Delete user data by ID' })
  //@apiresponse({ status: 200, description: 'The user data has been successfully deleted.' })
  //@apiresponse({ status: 404, description: 'User data not found.' })
  async remove(@Param('clientId') clientId: string): Promise<Client> {
    return this.clientService.remove(clientId);
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a custom MongoDB query' })
  //@apiresponse({ status: 200, description: 'Query executed successfully.' })
  //@apiresponse({ status: 400, description: 'Invalid query.' })
  //@apiresponse({ status: 500, description: 'Internal server error.' })
  async executeQuery(@Body() query: any): Promise<any> {
    try {
      return await this.clientService.executeQuery(query);
    } catch (error) {
      throw error;  // You might want to handle errors more gracefully
    }
  }
}
