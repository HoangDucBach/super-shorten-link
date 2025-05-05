import { Body, Controller, Get, HttpStatus, Param, Post, Redirect, Inject, NotFoundException, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { QueryBus } from '@nestjs/cqrs';
import { CacheService } from 'src/cache/cache.service';
import { GetAllShortLinkQuery, GetShortLinkByIdQuery } from './cqrs/queries/short-link.query';
import { ThrottlerGuard } from '@nestjs/throttler';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ShortIdGenService } from 'src/short-id-gen/short-id-gen.service';
import { QUEUE_PERSISTENCE, JOB_PERSIST_SHORTLINK } from 'src/job-queue-module/job-queue.constants';

@UseGuards(ThrottlerGuard)
@Controller('short-links')
export class ShortLinkController {
  constructor(
    @InjectQueue(QUEUE_PERSISTENCE)
    private persistenceQueue: Queue,

    @Inject(CacheService)
    private readonly cacheService: CacheService,

    @Inject(ShortIdGenService) private shortIdGenService: ShortIdGenService,
    private queryBus: QueryBus,

  ) { }

  @Post()
  async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
    try {
      const { longUrl } = createShortLinkDto;
      const shortId = await this.shortIdGenService.generateShortId();

      await this.persistenceQueue.add(JOB_PERSIST_SHORTLINK, { // <--- CHANGE JOB NAME HERE
        shortId: shortId,
        longUrl: longUrl,
      }, {
        jobId: `write-${shortId}`,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      });
      return {
        status: 'Created',
        code: HttpStatus.CREATED,
        message: 'Insert data success',
        payload: {
          shortId: shortId,
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

  @Get()
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
  @Redirect('https://docs.nestjs.com', HttpStatus.MOVED_PERMANENTLY)
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
