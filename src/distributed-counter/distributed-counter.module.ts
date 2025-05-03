import { DynamicModule, Module } from '@nestjs/common';
import { DistributedCounterService } from './distributed-counter.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from './distributed-counter.constants';
import Redis, { RedisOptions } from "ioredis";

export class DistributedCounterModule {

  static registerAsync(): DynamicModule {
    return {
      module: DistributedCounterModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_CLIENT,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService): Promise<Redis> => {
            const redisOptions: RedisOptions = {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
              db: configService.get<number>('REDIS_DB'),
              retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                console.log(`Redis retry connection attempt ${times}, delaying for ${delay}ms`);
                return delay;
              },
              enableOfflineQueue: true,
            };

            const redisClient = new Redis(redisOptions);

            redisClient.on('error', (err) => {
              console.error('Redis Client Error (from factory):', err);
            });
            
            redisClient.on('connect', () => {
              console.log('Connected to Redis (from factory)');
            });

            return redisClient;
          },
        },
        DistributedCounterService,
      ],
      exports: [DistributedCounterService],
    };
  }
}
