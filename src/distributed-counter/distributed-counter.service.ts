import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './distributed-counter.constants';

const COUNTER_KEY = 'global:counter';
const COUNTER_SHARD_COUNT = 16;

@Injectable()
export class DistributedCounterService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DistributedCounterService.name);

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing distributed counter shards...');
        await this.initializeCounters();
    }

    async onModuleDestroy() {
        if (this.redis && typeof this.redis.quit === 'function') {
            try {
                await this.redis.quit();
                this.logger.log('Redis connection closed.');
            } catch (error) {
                this.logger.error('Error closing Redis connection:', error);
            }
        } else {
            this.logger.warn('Redis client not available or cannot be closed during module destroy.');
        }
    }

    private async initializeCounters(): Promise<void> {
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready, skipping counter initialization.');
            return;
        }

        try {
            const multi = this.redis.multi();
            for (let i = 0; i < COUNTER_SHARD_COUNT; i++) {
                multi.setnx(`${COUNTER_KEY}:${i}`, '0');
            }
            await multi.exec();
            this.logger.log('Distributed counter shards initialized successfully.');
        } catch (error) {
            this.logger.error('Failed to initialize counter shards:', error);
            throw error;
        }
    }

    async getNextCounterValue(): Promise<number> {
        try {
            if (!this.redis || this.redis.status !== 'ready') {
                this.logger.error('Redis not ready for INCR operation.');
                throw new Error('Redis service is not ready to generate unique ID.');
            }

            const shardIndex = Math.floor(Math.random() * COUNTER_SHARD_COUNT);
            const shardKey = `${COUNTER_KEY}:${shardIndex}`;

            const shardValue = await this.redis.incr(shardKey);
            const globalPosition = (shardValue * COUNTER_SHARD_COUNT) + shardIndex;

            return globalPosition;

        } catch (error) {
            this.logger.error('Error performing Redis INCR operation:', error);
            throw new Error(`Failed to get next distributed counter value: ${error.message}`);
        }
    }

    async getCounterStats(): Promise<{ totalCount: number; shardCounts: number[] }> {
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready or client not available, cannot get counter stats.');
            return { totalCount: 0, shardCounts: Array(COUNTER_SHARD_COUNT).fill(0) };
        }
        try {
            const keys = Array.from({ length: COUNTER_SHARD_COUNT }, (_, i) => `${COUNTER_KEY}:${i}`);
            const shardValuesStr = await this.redis.mget(keys);
            const shardValues = shardValuesStr.map(val => parseInt(val || '0', 10));
            const simpleSum = shardValues.reduce((sum, val) => sum + val, 0);

            return {
                totalCount: simpleSum,
                shardCounts: shardValues,
            };
        } catch (error) {
            this.logger.error('Error getting counter stats:', error);
            return { totalCount: 0, shardCounts: Array(COUNTER_SHARD_COUNT).fill(0) };
        }
    }

    async resetCounters(): Promise<void> {
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready or client not available, cannot reset counters.');
            return;
        }
        try {
            const multi = this.redis.multi();
            for (let i = 0; i < COUNTER_SHARD_COUNT; i++) {
                multi.set(`${COUNTER_KEY}:${i}`, '0');
            }
            await multi.exec();
            this.logger.log('Distributed counters reset successfully.');
        } catch (error) {
            this.logger.error('Error resetting counters:', error);
            throw error;
        }
    }
}
