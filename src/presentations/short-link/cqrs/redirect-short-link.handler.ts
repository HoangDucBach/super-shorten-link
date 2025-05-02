import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedirectShortLinkCommand } from './redirect-short-link.command';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLink } from 'src/infrastructures/entities/short-link.entity';

@CommandHandler(RedirectShortLinkCommand)
export class RedirectShortLinkHandler implements ICommandHandler<RedirectShortLinkCommand> {
    constructor(
        @InjectRepository(ShortLink, "read_connection")
        private shortLinkRepository: ShortLinkRepository
    ) { }

    async execute(command: RedirectShortLinkCommand): Promise<string> {
        const { shortId } = command;
        const shortLink = await this.shortLinkRepository.getShortLinkById(shortId);

        if (!shortLink) {
            throw new Error('Short link not found');
        }

        // Optionally: increment visit count or add analytics here

        return shortLink.longUrl;
    }
}