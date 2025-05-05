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

    @ApiProperty({
        description: 'The custom short ID for the shortened URL (optional)',
        example: 'customShortId123',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(1, 20, { message: 'Short ID must be between 1 and 20 characters long' })
    shortId?: string;
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