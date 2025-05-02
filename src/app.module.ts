import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructures/config/environment-config/environment-config.module';
import { UserModule } from './presentations/user/user.module';
import { UsecaseProxyModule } from './infrastructures/usecase-proxy/usecase-proxy.module';
import { UserController } from './presentations/user/user.controller';
import { ShortLinkController } from './presentations/short-link/short-link.controller';
import { ShortLinkModule } from './presentations/short-link/short-link.module';
import { DistributedCounterModule } from './distributed-counter/distributed-counter.module';
import { ShortIdGenModule } from './short-id-gen/short-id-gen.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    CqrsModule.forRoot(),
    UserModule,
    ShortLinkModule,
    EnvironmentConfigModule,
    DistributedCounterModule,
    ShortIdGenModule
  ,CacheModule],
  controllers: [UserController, ShortLinkController],
})
export class AppModule { }
