import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from './create-short-link.command';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLinkM } from 'src/domains/model/short-link';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseStreamType } from 'src/domains/config/database.interface';
import { ShortLink } from 'src/infrastructures/entities/short-link.entity';
import { CreateShortLinkUseCases } from 'src/applications/use-cases/createShortLink.usecase';
import { UseCaseProxy } from 'src/infrastructures/usecase-proxy/usecase-proxy';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { BadRequestException, Inject } from '@nestjs/common';
import { ShortLinkCreatedEvent } from '../events/short-link-created.event';

@CommandHandler(CreateShortLinkCommand)
export class CreateShortLinkHandler implements ICommandHandler<CreateShortLinkCommand> {
  constructor(
    @Inject(UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE)
    private readonly createShortLinkUseCase: UseCaseProxy<CreateShortLinkUseCases>,
    private eventBus: EventBus,
  ) { }

  async execute(command: CreateShortLinkCommand): Promise<ShortLinkM> {
    const { longUrl } = command;
    const shortLink = new ShortLinkM();

    if (!longUrl) {
      throw new BadRequestException('longUrl is required');
    }

    shortLink.longUrl = longUrl;

    const createdShortLink = await this.createShortLinkUseCase.getInstance().execute(shortLink);

    this.eventBus.publish(new ShortLinkCreatedEvent(createdShortLink));

    return createdShortLink;
  }
}
