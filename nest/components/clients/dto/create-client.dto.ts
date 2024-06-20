import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({ example: 'paid_giirl_shruthiee', description: 'Channel link of the user' })
    readonly channelLink: string;
  
    @ApiProperty({ example: 'shruthi', description: 'Database collection name' })
    readonly dbcoll: string;
  
    @ApiProperty({ example: 'PaidGirl.netlify.app/Shruthi1', description: 'Link of the user' })
    readonly link: string;
  
    @ApiProperty({ example: 'Shruthi Reddy', description: 'Name of the user' })
    readonly name: string;
  
    @ApiProperty({ example: '+916265240911', description: 'Phone number of the user' })
    readonly number: string;
  
    @ApiProperty({ example: 'Ajtdmwajt1@', description: 'Password of the user' })
    readonly password: string;
  
    @ApiProperty({ example: 'https://shruthi1.glitch.me', description: 'Repl link of the user' })
    readonly repl: string;
  
    @ApiProperty({ example: '1BQANOTEuMTA4LjUg==', description: 'Session token' })
    readonly session: string;
  
    @ApiProperty({ example: 'ShruthiRedd2', description: 'Username of the user' })
    readonly userName: string;
  
    @ApiProperty({ example: 'shruthi1', description: 'Client ID of the user' })
    readonly clientId: string;
  
    @ApiProperty({ example: 'https://shruthi1.glitch.me/exit', description: 'Deployment key URL' })
    readonly deployKey: string;
  
    @ApiProperty({ example: 'ShruthiRedd2', description: 'Main account of the user' })
    readonly mainAccount: string;
  
    @ApiProperty({ example: 'booklet_10', description: 'Product associated with the user' })
    readonly product: string;
}
