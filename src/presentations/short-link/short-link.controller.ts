import { Body, Controller, Get, HttpStatus, Param, Post, Redirect, Inject, NotFoundException, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/cache.service';
import { CreateShortLinkCommand } from './cqrs/commands/short-link.command';
import { GetAllShortLinkQuery, GetShortLinkByIdQuery } from './cqrs/queries/short-link.query';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('short-links')
export class ShortLinkController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(CacheService)
    private readonly cacheService: CacheService
  ) { }

  @Post('')
  async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
    try {
      const { longUrl } = createShortLinkDto;
      const result = await this.commandBus.execute(
        new CreateShortLinkCommand(longUrl),
      );

      return {
        status: 'Created',
        code: HttpStatus.CREATED,
        message: 'Insert data success',
        payload: {
          shortId: result.shortId,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          status: 'Bad Request',
          code: HttpStatus.BAD_REQUEST,
          message: error.message,
          payload: null,
        };
      }
      console.error('Error creating short link:', error);
      return {
        status: 'Internal Server Error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred while creating the short link.',
        payload: null,
      };
    }
  }

  @Get('')
  async getAllShortLinks() {
    try {
      const result = await this.queryBus.execute(
        new GetAllShortLinkQuery(),
      );
      return {
        status: 'OK',
        code: HttpStatus.OK,
        message: 'Get all data success',
        payload: {
          shortLinks: result,
        },
      };
    } catch (error) {
      console.error('Error getting all short links:', error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        status: 'Internal Server Error',
        message: 'An unexpected error occurred while retrieving short links.',
        payload: null,
      };
    }
  }

  @Get('/:shortId')
  async getShortLinkById(@Param('shortId') shortId: string) {
    try {
      let longUrl = await this.cacheService.getUrl(shortId);
      let payload: any;

      if (longUrl == null) {
        const result = await this.queryBus.execute(new GetShortLinkByIdQuery(shortId));

        if (!result || !result.longUrl) {
          throw new NotFoundException(`Short link with ID "${shortId}" not found.`);
        }

        longUrl = result.longUrl;
        payload = result;

        try {
          if (longUrl) {
            await this.cacheService.setUrl(shortId, longUrl);
          }
        } catch (cacheError) {
          console.error(`Failed to set cache for shortId ${shortId}:`, cacheError);
        }

      } else {
        payload = { shortId, longUrl };
      }

      return {
        status: 'OK',
        code: HttpStatus.OK,
        message: 'Get data success',
        payload: payload,
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 'Not Found',
          code: HttpStatus.NOT_FOUND,
          message: error.message,
          payload: null,
        };
      }

      if (error instanceof BadRequestException) {
        return {
          status: 'Bad Request',
          code: HttpStatus.BAD_REQUEST,
          message: error.message,
          payload: null,
        };
      }

      console.error(`Error getting short link by ID ${shortId}:`, error);
      return {
        status: 'Internal Server Error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred while retrieving the short link.',
        payload: null,
      };
    }
  }

  @Get('redirect/:shortId')
  @Redirect()
  async getAndRedirect(@Param('shortId') shortId: string) {
    try {
      const longUrl = await this.cacheService.getUrl(shortId);

      if (!longUrl) {
        throw new NotFoundException(`Short link with ID "${shortId}" not found.`);
      }

      return { url: longUrl };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.error(`Error redirecting short link ${shortId}:`, error);
      throw new InternalServerErrorException('An unexpected error occurred while redirecting.');
    }
  }
}
