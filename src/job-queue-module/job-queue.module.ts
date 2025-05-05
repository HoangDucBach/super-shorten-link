import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShortLinkPersistenceProcessor } from './processors/short-link.processor';
import { UsecaseProxyModule } from 'src/infrastructures/usecase-proxy/usecase-proxy.module'; // Needed by processor

import { QUEUE_PERSISTENCE } from './job-queue.constants';

@Module({})
export class JobQueueModule {

  static registerAsync(): DynamicModule {
    return {
      module: JobQueueModule,
      imports: [
        ConfigModule,
        UsecaseProxyModule,
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            connection: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
              db: configService.get<number>('REDIS_DB'),
            },
          }),
        }),
        BullModule.registerQueue({
          name: QUEUE_PERSISTENCE,
        }),
      ],
      providers: [
        ShortLinkPersistenceProcessor,
      ],
      exports: [
        BullModule,
      ],
    };
  }
}