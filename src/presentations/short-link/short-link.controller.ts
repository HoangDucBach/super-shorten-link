import { Body, Controller, Get, HttpStatus, Inject, Post, Redirect } from '@nestjs/common';
import { CreateShortLinkUseCases } from 'src/applications/use-cases/createShortLink.usecase';
import { GetAllShortLinkUseCases } from 'src/applications/use-cases/getAllShortLinks.usecase';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { GetShortLinkByIdUseCases } from 'src/applications/use-cases/getShortLinkByShortId.usecase';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { UseCaseProxy } from 'src/infrastructures/usecase-proxy/usecase-proxy';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from './cqrs/create-short-link.command';
import { GetShortLinkByIdQuery } from './cqrs/get-short-link-by-id.command';

@Controller('short-links')
export class ShortLinkController {
  constructor(
    @Inject(UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE)
    private readonly createShortLinkUsecaseProxy: UseCaseProxy<CreateShortLinkUseCases>,
    @Inject(UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE)
    private readonly getShortLinkByIdUsecaseProxy: UseCaseProxy<GetShortLinkByIdUseCases>,
    @Inject(UsecaseProxyModule.GET_ALL_SHORT_LINKS_USE_CASE)
    private readonly getUserUsecaseProxy: UseCaseProxy<GetAllShortLinkUseCases>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }


  @Post('')
  async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
    const { shortId, longUrl } = createShortLinkDto;
    const result = await this.commandBus.execute(
      // todo : add validation for shortId
      new CreateShortLinkCommand(shortId!, longUrl),
    );

    return {
      status: 'Created',
      code: HttpStatus.CREATED,
      message: 'Insert data success',
      data: result,
    };
  }

  @Get('')
  async getAllShortLinks() {
    const result = await this.getUserUsecaseProxy.getInstance().execute();
    return {
      status: 'OK',
      code: HttpStatus.OK,
      message: 'Get data success',
      data: result,
    };
  }

  @Get('/:shortId')
  async getShortLinkById(@Body() shortId: string) {
    const result = await this.queryBus.execute(new GetShortLinkByIdQuery(shortId));
    return {
      status: 'OK',
      code: HttpStatus.OK,
      message: 'Get data success',
      data: result,
    };
  }

  @Redirect('/redirect/:shortId')
  async redirectToLongUrl(@Body() shortId: string) {
    const shortLink = await this.queryBus.execute(new GetShortLinkByIdQuery(shortId));
    return {
      url: shortLink.longUrl,
      statusCode: HttpStatus.FOUND,
    };
  }
}
