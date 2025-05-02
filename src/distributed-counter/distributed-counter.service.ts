// src/distributed-counter/distributed-counter.service.ts

import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './distributed-counter.constants';

const COUNTER_KEY = 'global:counter';
const COUNTER_SHARD_COUNT = 16; // Example shard count, could be from config

/**
 * Service for managing a distributed counter using Redis.
 * Implements OnModuleInit to initialize counters on startup
 * and OnModuleDestroy to close the Redis connection on shutdown.
 */
@Injectable()
export class DistributedCounterService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DistributedCounterService.name);

    /**
     * Injects the Redis client instance using the defined token.
     * @param redis The Redis client instance provided by the module factory.
     */
    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) {
        // Avoid async operations in the constructor .
        // Initialization logic is moved to onModuleInit.
    }

    /**
     * Lifecycle hook called once the module has been initialized.
     * Used here to initialize the counter shards in Redis.
     */
    async onModuleInit() {
        this.logger.log('Initializing distributed counter shards...');
        await this.initializeCounters();
    }

    /**
     * Lifecycle hook called when the module is being destroyed (application shutting down).
     * Ensures the Redis connection is closed gracefully.
     */
    async onModuleDestroy() {
        if (this.redis && typeof this.redis.quit === 'function') {
            try {
                // Use quit() to close the connection gracefully
                await this.redis.quit();
                this.logger.log('Redis connection closed.');
            } catch (error) {
                this.logger.error('Error closing Redis connection:', error);
            }
        } else {
            this.logger.warn('Redis client not available or cannot be closed during module destroy.');
        }
    }

    /**
     * Initializes the counter shards in Redis using SETNX to avoid overwriting existing values.
     */
    private async initializeCounters(): Promise<void> {
        // Check if Redis client is ready before attempting operations
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready, skipping counter initialization.');
            // Consider throwing a more critical error if initialization is mandatory for startup
            // throw new Error('Redis client not ready for counter initialization');
            return;
        }

        try {
            const multi = this.redis.multi();
            for (let i = 0; i < COUNTER_SHARD_COUNT; i++) {
                // SETNX sets the key only if it does not already exist
                multi.setnx(`${COUNTER_KEY}:${i}`, '0');
            }
            await multi.exec();
            this.logger.log('Distributed counter shards initialized successfully.');
        } catch (error) {
            this.logger.error('Failed to initialize counter shards:', error);
            // Re-throw the error to indicate initialization failure
            throw error;
        }
    }

    /**
     * Gets the next unique counter value by incrementing a random shard.
     * Combines shard value and shard index to create a globally unique number.
     * @returns A promise that resolves to the next unique counter value.
     * @throws Error if Redis client is not ready or INCR operation fails.
     */
    async getNextCounterValue(): Promise<number> {
        try {
            // Check if Redis client is ready before attempting operations
            if (!this.redis || this.redis.status !== 'ready') {
                this.logger.error('Redis not ready for INCR operation.');
                // Throw an error instead of falling back to Date.now() to ensure uniqueness
                throw new Error('Redis service is not ready to generate unique ID.');
            }

            // Select a random shard index
            const shardIndex = Math.floor(Math.random() * COUNTER_SHARD_COUNT);
            const shardKey = `${COUNTER_KEY}:${shardIndex}`;

            // Increment the selected shard counter atomically
            const shardValue = await this.redis.incr(shardKey);

            // Calculate the global unique position
            // This formula ensures uniqueness across shards: (value_in_shard * total_shards) + shard_index
            const globalPosition = (shardValue * COUNTER_SHARD_COUNT) + shardIndex;

            return globalPosition;

        } catch (error) {
            this.logger.error('Error performing Redis INCR operation:', error);
            // Re-throw the error to indicate failure in getting the next value
            throw new Error(`Failed to get next distributed counter value: ${error.message}`);
        }
    }

    /**
     * Gets the current counts for all shards and the total count.
     * @returns A promise that resolves to an object containing total count and shard counts.
     * @throws Error if Redis client is not ready or MGET operation fails.
     */
    async getCounterStats(): Promise<{ totalCount: number; shardCounts: number[] }> {
        // Check if Redis client is ready before attempting operations
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready or client not available, cannot get counter stats.');
            // Return default values or throw error based on requirements
            return { totalCount: 0, shardCounts: Array(COUNTER_SHARD_COUNT).fill(0) };
        }
        try {
            // Get keys for all shards
            const keys = Array.from({ length: COUNTER_SHARD_COUNT }, (_, i) => `${COUNTER_KEY}:${i}`);
            // Use MGET to get values of all shard keys in a single round trip
            const shardValuesStr = await this.redis.mget(keys);
            // Parse string values to integers, defaulting to 0 if key does not exist
            const shardValues = shardValuesStr.map(val => parseInt(val || '0', 10));
            // Calculate the total sum
            const simpleSum = shardValues.reduce((sum, val) => sum + val, 0);

            return {
                totalCount: simpleSum,
                shardCounts: shardValues,
            };
        } catch (error) {
            this.logger.error('Error getting counter stats:', error);
            // Re-throw the error or return default values based on requirements
            return { totalCount: 0, shardCounts: Array(COUNTER_SHARD_COUNT).fill(0) };
        }
    }

    /**
     * Resets all distributed counter shards to 0.
     * @throws Error if Redis client is not ready or SET operation fails.
     */
    async resetCounters(): Promise<void> {
        // Check if Redis client is ready before attempting operations
        if (!this.redis || this.redis.status !== 'ready') {
            this.logger.warn('Redis not ready or client not available, cannot reset counters.');
            // Return or throw error based on requirements
            return;
        }
        try {
            // Use a multi transaction for atomicity when resetting all shards
            const multi = this.redis.multi();
            for (let i = 0; i < COUNTER_SHARD_COUNT; i++) {
                multi.set(`${COUNTER_KEY}:${i}`, '0');
            }
            await multi.exec();
            this.logger.log('Distributed counters reset successfully.');
        } catch (error) {
            this.logger.error('Error resetting counters:', error);
            // Re-throw the error to indicate failure
            throw error;
        }
    }
}