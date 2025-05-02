import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortLinkDto {
    @ApiProperty({
        description: 'The original long URL to be shortened',
        example: 'https://www.example.com/very/long/path/to/resource?with=parameters&and=more',
    })
    @IsString()
    @IsNotEmpty()
    @IsUrl({}, { message: 'Long URL must be a valid URL' })
    longUrl: string;
}

export class CreateShortLinkForReadDto {
    @IsString()
    @IsNotEmpty()
    shortId: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl({}, { message: 'Long URL must be a valid URL' })
    longUrl: string;
}