import { Module } from '@nestjs/common';
import { ShortIdGenService } from './short-id-gen.service';
import { DistributedCounterModule } from '../distributed-counter/distributed-counter.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DistributedCounterModule.registerAsync(),
    ConfigModule
  ],
  providers: [
    ShortIdGenService,
  ],
  exports: [
    ShortIdGenService,
  ],
})
export class ShortIdGenModule {}
