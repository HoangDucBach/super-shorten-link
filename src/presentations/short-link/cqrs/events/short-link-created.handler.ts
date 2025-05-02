import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShortLinkCreatedEvent } from './short-link-created.event';
import { Inject } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { UseCaseProxy } from 'src/infrastructures/usecase-proxy/usecase-proxy';
import { WriteShortLinkToReadDatabaseUseCases } from 'src/applications/use-cases/writeShortLinkToReadDatabase.usecase';
import { ShortLinkForRead } from 'src/infrastructures/entities/short-link.entity';

@EventsHandler(ShortLinkCreatedEvent)
export class ShortLinkCreatedHandler implements IEventHandler<ShortLinkCreatedEvent> {
    constructor(
        @Inject(UsecaseProxyModule.WRITE_SHORT_LINK_TO_READ_DATABASE_USE_CASE)
        private writeShortLinkToReadDatabase: UseCaseProxy<WriteShortLinkToReadDatabaseUseCases>

    ) { }

    handle(event: ShortLinkCreatedEvent) {
        const { shortLink } = event;
        const shortLinkForRead = new ShortLinkForRead();
        shortLinkForRead.shortId = shortLink.shortId;
        shortLinkForRead.longUrl = shortLink.longUrl;
        this.writeShortLinkToReadDatabase.getInstance().execute({
            shortId: shortLinkForRead.shortId,
            longUrl: shortLinkForRead.longUrl,
        });
    }
}
