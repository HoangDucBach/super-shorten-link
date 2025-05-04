
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmConfigModule } from 'src/infrastructures/config/typeorm/typeorm.module';
import { RedisHealthIndicator } from './cache.health';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TerminusModule, TypeOrmConfigModule, CacheModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator]
})
export class HealthModule { }
