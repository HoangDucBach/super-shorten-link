import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module';
import { UserController } from './short-link.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  controllers: [UserController],
})
export class UserModule { }
