import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from './create-short-link.command';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLinkM } from 'src/domains/model/short-link';

@CommandHandler(CreateShortLinkCommand)
export class CreateShortLinkHandler implements ICommandHandler<CreateShortLinkCommand> {
  constructor(private shortLinkRepository: ShortLinkRepository) {}

  async execute(command: CreateShortLinkCommand): Promise<ShortLinkM> {
    const { shortId, longUrl } = command;
    const shortLink = new ShortLinkM();
    shortLink.shortId = shortId;
    shortLink.longUrl = longUrl;
    
    return this.shortLinkRepository.createShortLink(shortLink);
  }
}
