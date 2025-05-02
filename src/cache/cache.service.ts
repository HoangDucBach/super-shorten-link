import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './cache.constants';

Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CacheService.name);

    
    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) {
    }

  
    async onModuleInit() {
        this.logger.log('Initializing distributed counter shards...');
        // await this.initializeCounters();
    }

   
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


    async getUrl(url: string): Promise<string | null> {
        try {
            const value = await this.redis.get(url);
            return value || null;
        } catch (error) {
            this.logger.error('Error getting URL from cache:', error);
            return null;
        }
    }
    async setUrl(url: string, data: string): Promise<void> {
        try {
            await this.redis.set(url, data, 'EX', 3600); // Set expiration to 1 hour
        } catch (error) {
            this.logger.error('Error setting URL in cache:', error);
        }
    }
    async deleteUrl(url: string): Promise<void> {
        try {
            await this.redis.del(url);
        } catch (error) {
            this.logger.error('Error deleting URL from cache:', error);
        }
    }
    async clearCache(): Promise<void> {
        try {
            const keys = await this.redis.keys('*');
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
        } catch (error) {
            this.logger.error('Error clearing cache:', error);
        }
    }
    async getAllKeys(): Promise<string[]> {
        try {
            const keys = await this.redis.keys('*');
            return keys;
        } catch (error) {
            this.logger.error('Error getting all keys from cache:', error);
            return [];
        }
    }
}