import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShortLinkCreatedEvent } from './short-link-created.event';
import { Inject } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@EventsHandler(ShortLinkCreatedEvent)
export class ShortLinkCacheHandler implements IEventHandler<ShortLinkCreatedEvent> {
    constructor(
        @Inject(CacheService)
        private readonly cacheService: CacheService,

    ) { }

    handle(event: ShortLinkCreatedEvent) {
        const { shortLink } = event
        this.cacheService.setUrl(shortLink.shortId, shortLink.longUrl);
        console.log("Cache set: ", shortLink.shortId, shortLink.longUrl);
    }
}
