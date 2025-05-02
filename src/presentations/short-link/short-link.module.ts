import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { ShortLinkController } from './short-link.controller';
import { ShortIdGenModule } from 'src/short-id-gen/short-id-gen.module';

@Module({
  imports: [UsecaseProxyModule.register(), ShortIdGenModule],
  controllers: [ShortLinkController],
})
export class ShortLinkModule { }
