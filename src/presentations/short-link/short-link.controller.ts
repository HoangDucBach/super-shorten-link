import { Body, Controller, Get, Inject, Post, Redirect } from '@nestjs/common';
import { CreateShortLinkUseCases } from 'src/applications/use-cases/createShortLink.usecase';
import { GetAllShortLinkUseCases } from 'src/applications/use-cases/getAllShortLinks.usecase';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { GetShortLinkByIdUseCases } from 'src/applications/use-cases/getShortLinkByShortId.usecase';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { UseCaseProxy } from 'src/infrastructures/usecase-proxy/usecase-proxy';

@Controller('short-links')
export class ShortLinkController {
  constructor(
    @Inject(UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE)
    private readonly createShortLinkUsecaseProxy: UseCaseProxy<CreateShortLinkUseCases>,
    @Inject(UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE)
    private readonly getShortLinkByIdUsecaseProxy: UseCaseProxy<GetShortLinkByIdUseCases>,
    @Inject(UsecaseProxyModule.GET_ALL_SHORT_LINKS_USE_CASE)
    private readonly getUserUsecaseProxy: UseCaseProxy<GetAllShortLinkUseCases>,
  ) { }


  @Post('')
  async createShortLink(@Body() createShortLinkDto: CreateShortLinkDto) {
    const { shortId, longUrl } = createShortLinkDto;
    const result = await this.createShortLinkUsecaseProxy.getInstance().execute({
      shortId: shortId,
      longUrl: longUrl,
    });
    return {
      status: 'Created',
      code: 201,
      message: 'Insert data success',
      data: result,
    };
  }

  @Get('')
  async getAllShortLinks() {
    const result = await this.getUserUsecaseProxy.getInstance().execute();
    return {
      status: 'OK',
      code: 200,
      message: 'Get data success',
      data: result,
    };
  }

  @Get('/:shortId')
  async getShortLinkById(@Body() shortId: string) {
    const result = await this.getShortLinkByIdUsecaseProxy.getInstance().execute(shortId);
    return {
      status: 'OK',
      code: 200,
      message: 'Get data success',
      data: result,
    };
  }

  @Redirect('/redirect/:shortId')
  async redirectToLongUrl(@Body() shortId: string) {
    const result = await this.getShortLinkByIdUsecaseProxy.getInstance().execute(shortId);
    return {
      status: 'OK',
      code: 300,
      message: 'Redirecting to long URL',
      data: result,
    };
  }
}
