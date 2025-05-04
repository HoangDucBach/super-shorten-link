import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from "ioredis";
import { REDIS_CLIENT } from './cache.constants';
import { CacheService } from './cache.service';

export class CacheModule {
  static registerAsync(): DynamicModule {
    return {
      module: CacheModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_CLIENT,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService): Promise<Redis> => {
            const redisOptions: RedisOptions = {
              host: configService.get<string>('CACHE_REDIS_HOST'),
              port: configService.get<number>('CACHE_REDIS_PORT'),
              password: configService.get<string>('CACHE_REDIS_PASSWORD'),
              db: configService.get<number>('cACHE_REDIS_DB'),
              retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
              },
              enableOfflineQueue: true,
            };

            const redisClient = new Redis(redisOptions);

            redisClient.on('error', (err) => {
              console.error('Cache Redis Client Error (from factory):', err);
            });

            redisClient.on('connect', () => {
            });

            return redisClient;
          },
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}
