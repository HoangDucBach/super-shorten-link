import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { ShortLinkController } from './short-link.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  controllers: [ShortLinkController],
})
export class ShortLinkModule { }
