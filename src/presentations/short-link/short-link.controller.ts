import { Body, Controller, Get, HttpStatus, Param, Post, Redirect, Inject } from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from './cqrs/commands/create-short-link.command';
import { GetShortLinkByIdQuery } from './cqrs/queries/get-short-link-by-id.command';
import { CacheService } from 'src/cache/cache.service';

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
        data: result,
      };
    } catch (error) {
      return {
        status: 'Bad Request',
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @Get('')
  async getAllShortLinks() {
    // const result = await this..getInstance().execute();
    // return {
    //   status: 'OK',
    //   code: HttpStatus.OK,
    //   message: 'Get data success',
    //   data: result,
    // };
  }

  @Get('/:shortId')
  @Redirect()
  async getShortLinkById(@Param('shortId') shortId: string) {
    try {
      console.log("Fetching from cache...");
      let longUrl = await this.cacheService.getUrl(shortId);
      console.log("Cache result: ", longUrl);
      if (longUrl == null) {
        const result = await this.queryBus.execute(new GetShortLinkByIdQuery(shortId));
        this.cacheService.setUrl(shortId, result.longUrl);
        return {
          url: result.longUrl,
          code: HttpStatus.FOUND,
        };
      }

      return {
        url: longUrl,
        code: HttpStatus.FOUND,
      }

    } catch (error) {
      return {
        status: 'Not Found',
        code: HttpStatus.NOT_FOUND,
      };
    }
  }

}
