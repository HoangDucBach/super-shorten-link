import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortLinkDto {
    @ApiProperty({
        description: 'A unique short identifier for the URL',
        example: 'abc123',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 12, { message: 'Short ID must be between 1 and 12 characters' })
    shortId: string;

    @ApiProperty({
        description: 'The original long URL to be shortened',
        example: 'https://www.example.com/very/long/path/to/resource?with=parameters&and=more',
    })
    @IsString()
    @IsNotEmpty()
    @IsUrl({}, { message: 'Long URL must be a valid URL' })
    longUrl: string;
}