import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { ShortLinkController } from './short-link.controller';
import { ShortIdGenModule } from 'src/short-id-gen/short-id-gen.module';
import { CommandHandlers, EventsHandlers, QueryHandlers } from './cqrs';
import { CacheModule } from 'src/cache/cache.module';
import { JobQueueModule } from 'src/job-queue-module/job-queue.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ShortIdGenModule,
    JobQueueModule.registerAsync(),
    CacheModule.registerAsync()
  ],
  controllers: [ShortLinkController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventsHandlers,
  ],
})
export class ShortLinkModule { }
