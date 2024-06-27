import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export class SearchBufferClientDto {
    @ApiPropertyOptional({ description: 'Mobile number of the user', example: '917330803480' })
    mobile: string;
  
    @ApiPropertyOptional({ description: 'Session information of the user', example: 'string' })
    session: string;
  
    @ApiPropertyOptional({ description: 'First name of the user', example: 'Praveen' })
    firstName: string;
  
    @ApiPropertyOptional({ description: 'Last name of the user', example: null })
    lastName?: string | null;
  
    @ApiPropertyOptional({ description: 'Username of the user', example: null })
    username?: string | null;
  
    @ApiPropertyOptional({ description: 'Number of channels', example: 56 })
    channels: number;
  
    @ApiPropertyOptional({ description: 'Number of personal chats', example: 74 })
    personalChats: number;
  
    @ApiPropertyOptional({ description: 'Boolean flag indicating if demo was given', example: false })
    demoGiven: boolean;
  
    @ApiPropertyOptional({ description: 'Number of messages', example: 0 })
    msgs: number;
  
    @ApiPropertyOptional({ description: 'Total number of chats', example: 195 })
    totalChats: number;
  
    @ApiPropertyOptional({ description: 'Timestamp of last active', example: 1718260523 })
    lastActive: number;
  
    @ApiPropertyOptional({ description: 'Date of creation in YYYY-MM-DD format', example: '2024-06-03' })
    date: string;
  
    @ApiPropertyOptional({ description: 'Telegram ID of the user', example: '2022068676' })
    tgId: string;
  
    @ApiPropertyOptional({ description: 'Timestamp of last update', example: '2024-06-13' })
    lastUpdated: string;
  
    @ApiPropertyOptional({ description: 'Number of movies', example: 0 })
    movieCount: number;
  
    @ApiPropertyOptional({ description: 'Number of photos', example: 0 })
    photoCount: number;
  
    @ApiPropertyOptional({ description: 'Number of videos', example: 0 })
    videoCount: number;
  
    @ApiPropertyOptional({ description: 'Gender of the user', example: null })
    gender?: string | null;
  
    @ApiPropertyOptional({ description: 'Number of other photos', example: 0 })
    otherPhotoCount: number;
  
    @ApiPropertyOptional({ description: 'Number of other videos', example: 0 })
    otherVideoCount: number;
  
    @ApiPropertyOptional({ description: 'Number of own photos', example: 0 })
    ownPhotoCount: number;
  
    @ApiPropertyOptional({ description: 'Number of own videos', example: 0 })
    ownVideoCount: number;
  
    @ApiPropertyOptional({ description: 'Number of contacts', example: 105 })
    contacts: number;
  
    @ApiPropertyOptional({
      description: 'Call details of the user',
      example: {
        outgoing: 1,
        incoming: 0,
        video: 1,
        chatCallCounts: [],
        totalCalls: 1,
      },
    })
    calls: {
      outgoing: number;
      incoming: number;
      video: number;
      chatCallCounts: any[];
      totalCalls: number;
    };
}
