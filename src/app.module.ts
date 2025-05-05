import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructures/config/environment-config/environment-config.module';
import { UsecaseProxyModule } from './infrastructures/usecase-proxy/usecase-proxy.module';
import { ShortLinkController } from './presentations/short-link/short-link.controller';
import { ShortLinkModule } from './presentations/short-link/short-link.module';
import { DistributedCounterModule } from './distributed-counter/distributed-counter.module';
import { ShortIdGenModule } from './short-id-gen/short-id-gen.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from './cache/cache.module';
import { RateLimitingModule } from './rate-limting/rate-limting.module';
import { HealthModule } from './health/health.module';
import { JobQueueModule } from './job-queue-module/job-queue.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    CqrsModule.forRoot(),
    ShortLinkModule,
    EnvironmentConfigModule,
    DistributedCounterModule,
    ShortIdGenModule,
    CacheModule.registerAsync(),
    RateLimitingModule,
    HealthModule,
    JobQueueModule.registerAsync(),
  ],
})
export class AppModule { }
