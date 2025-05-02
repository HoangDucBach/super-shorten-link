import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from "ioredis";
import { REDIS_CLIENT } from './cache.constants';
import { CacheService } from './cache.service';

export class CacheModule {

  /**
   * Registers the DistributedCounterModule asynchronously.
   * This method sets up the providers for the Redis client and the DistributedCounterService.
   * @returns A DynamicModule configuration.
   */
  static registerAsync(): DynamicModule {
    return {
      module: CacheModule, // The current module class
      imports: [ConfigModule], // Import ConfigModule to access ConfigService
      providers: [
        // Provider for the Redis client instance.
        // Uses a factory to create the client asynchronously based on configuration.
        {
          provide: REDIS_CLIENT, // Use the defined token to provide the Redis client instance
          inject: [ConfigService], // Inject ConfigService into the factory
          useFactory: async (configService: ConfigService): Promise<Redis> => {
            // Retrieve Redis configuration from ConfigService
            const redisOptions: RedisOptions = {
              host: configService.get<string>('CACHE_REDIS_HOST'),
              port: configService.get<number>('CACHE_REDIS_PORT'),
              password: configService.get<string>('CACHE_REDIS_PASSWORD'),
              db: configService.get<number>('cACHE_REDIS_DB'),
              // Configure retry strategy for connection attempts
              retryStrategy(times) {
                const delay = Math.min(times * 50, 2000); // Exponential backoff up to 2 seconds
                console.log(`Cache Redis retry connection attempt ${times}, delaying for ${delay}ms`);
                return delay;
              },
              // Enable offline queueing so commands sent before connection is ready are queued
              enableOfflineQueue: true,
            };

            // Create and return a new Redis client instance
            const redisClient = new Redis(redisOptions);

            // Log Redis client errors
            redisClient.on('error', (err) => {
              console.error('Cache Redis Client Error (from factory):', err);
            });
            // Log successful connection
            redisClient.on('connect', () => {
              console.log('Connected to Cache Redis (from factory)');
            });

            // Return the Redis client instance.
            // ioredis handles connection in the background, commands are queued.
            // The service using this client should handle cases where the client is not yet 'ready'.
            return redisClient;
          },
        },
        // Provider for the DistributedCounterService.
        // NestJS will automatically inject the REDIS_CLIENT instance into its constructor
        // because it's defined as a provider and the Redis client is provided in this module.
        CacheService,
      ],
      // Export the DistributedCounterService class so other modules can inject it directly by type.
      exports: [CacheService],
    };
  }
}
