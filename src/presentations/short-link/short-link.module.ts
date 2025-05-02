import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { ShortLinkController } from './short-link.controller';
import { ShortIdGenModule } from 'src/short-id-gen/short-id-gen.module';
import { CommandHandlers, QueryHandlers } from './cqrs';
import { CreateShortLinkHandler } from './cqrs/create-short-link.handler';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ShortIdGenModule
  ],
  controllers: [ShortLinkController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ShortLinkModule { }
