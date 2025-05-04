// src/health/redis.health.ts (hoặc vị trí phù hợp khác)
import { Injectable, Inject, Dependencies } from '@nestjs/common';
import { HealthIndicatorService, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
@Dependencies(HealthIndicatorService)
export class RedisHealthIndicator {
    constructor(
        private readonly healthIndicatorService: HealthIndicatorService,
        private readonly redisClient: Redis,
    ) {
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        const indicator = this.healthIndicatorService.check(key);

        try {
            const pong = await this.redisClient.ping();

            if (pong === 'PONG') {
                return indicator.up();
            } else {
                return indicator.down({ reason: 'Redis PING command did not return PONG' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Redis connection failed';
            return indicator.down({ error: errorMessage });
        }
    }
}