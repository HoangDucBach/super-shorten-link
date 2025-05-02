import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Redirect } from '@nestjs/common';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from './cqrs/create-short-link.command';
import { GetShortLinkByIdQuery } from './cqrs/get-short-link-by-id.command';
import { url } from 'inspector';

@Controller('short-links')
export class ShortLinkController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }


  // @Post('')
  // async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
  //   const { longUrl } = createShortLinkDto;
  //   const result = await this.commandBus.execute(
  //     new CreateShortLinkCommand(longUrl),
  //   );

  //   return {
  //     status: 'Created',
  //     code: HttpStatus.CREATED,
  //     message: 'Insert data success',
  //     data: result,
  //   };
  // }

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
      const result = await this.queryBus.execute(new GetShortLinkByIdQuery(shortId));

      return {
        url: result.longUrl,
        code: HttpStatus.FOUND,
      };
    } catch (error) {
      return {
        url: '/404',
        status: 'Not Found',
        code: HttpStatus.NOT_FOUND,
      };
    }
  }

}
