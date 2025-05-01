import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructures/config/environment-config/environment-config.module';
import { UserModule } from './presentations/user/user.module';
import { UsecaseProxyModule } from './infrastructures/usecase-proxy/usecase-proxy.module';
import { UserController } from './presentations/user/user.controller';
import { ShortLinkController } from './presentations/short-link/short-link.controller';
import { ShortLinkModule } from './presentations/short-link/short-link.module';

@Module({
  imports: [UsecaseProxyModule.register(), UserModule, ShortLinkModule, EnvironmentConfigModule],
  controllers: [UserController, ShortLinkController],
})
export class AppModule { }
