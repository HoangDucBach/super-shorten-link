import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { DistributedCounterService } from '../distributed-counter/distributed-counter.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShortIdGenService implements OnModuleInit {
    private readonly logger = new Logger(ShortIdGenService.name);
    private readonly NUM_CACHE_POOLS; // Number of partitions
    private readonly CACHE_POOL_SIZE;
    private readonly idCachePools: string[][];
    private readonly LOW_THRESHOLD_EACH_POOL;
    private isGeneratingBatch = false;

    constructor(
        private readonly counterService: DistributedCounterService,
        private readonly configService: ConfigService
    ) {
        this.NUM_CACHE_POOLS = this.configService.get<number>('SHORT_ID_NUM_POOLS');
        this.CACHE_POOL_SIZE = this.configService.get<number>('SHORT_ID_CACHE_POOL_SIZE');
        this.LOW_THRESHOLD_EACH_POOL = this.configService.get<number>('SHORT_ID_LOW_THRESHOLD');
        this.idCachePools = Array.from({ length: this.NUM_CACHE_POOLS }, () => []);
        this.logger.verbose(`ShortIdGenService initialized with ${this.NUM_CACHE_POOLS} pools of size ${this.CACHE_POOL_SIZE}`);
        this.logger.verbose(`Low threshold for each pool: ${this.LOW_THRESHOLD_EACH_POOL}`);
        this.logger.verbose(`Cache pool size: ${this.CACHE_POOL_SIZE}`);
        this.logger.verbose(`Total cache size: ${this.NUM_CACHE_POOLS * this.CACHE_POOL_SIZE}`);
        this.logger.verbose(`Low threshold for each pool: ${this.LOW_THRESHOLD_EACH_POOL}`);
        this.logger.verbose(`Total cache size: ${this.NUM_CACHE_POOLS * this.CACHE_POOL_SIZE}`);
        this.logger.verbose('ShortIdGenService initialized.');
    }

    async onModuleInit() {
        await this.prewarmCache();
    }

    generateShortId(): string {
        for (let i = 0; i < this.NUM_CACHE_POOLS; i++) {
            const pool = this.idCachePools[i];
            if (pool.length > 0) {
                const id = pool.pop();
                if (pool.length < this.LOW_THRESHOLD_EACH_POOL) {
                    this.generateIdsForCachePool(i).catch(err =>
                        this.logger.error(`Failed to refill pool ${i}: ${err.message}`)
                    );
                }
                if (id) return id;
            }
        }
        throw new Error('No IDs available in any pool');
    }

    private async generateIdsForCachePool(poolIndex: number): Promise<void> {
        const newIds: string[] = [];
        for (let i = 0; i < this.CACHE_POOL_SIZE; i++) {
            const uniqueNumber = await this.counterService.getNextCounterValue();
            newIds.push(this.toBase62(uniqueNumber));
        }
        this.idCachePools[poolIndex].push(...newIds);
        this.logger.debug(`Refilled pool ${poolIndex} with ${newIds.length} IDs`);
    }

    private async generateIdBatch(): Promise<void> {
        if (this.isGeneratingBatch) return;
        this.isGeneratingBatch = true;
        try {
            await Promise.all(
                Array.from({ length: this.NUM_CACHE_POOLS }, (_, i) =>
                    this.generateIdsForCachePool(i)
                )
            );
        } finally {
            this.isGeneratingBatch = false;
        }
    }

    private toBase62(num: number): string {
        const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const BASE = CHARS.length;
        let value = num;

        if (value === 0) {
            return CHARS[0];
        }

        let encoded = '';
        while (value > 0) {
            encoded = CHARS[value % BASE] + encoded;
            value = Math.floor(value / BASE);
        }

        const MIN_LENGTH = 7;
        while (encoded.length < MIN_LENGTH) {
            encoded = CHARS[0] + encoded;
        }

        return encoded;
    }

    getPartitionNumber(shortId: string): number {
        let hash = 0;
        for (let i = 0; i < shortId.length; i++) {
            const char = shortId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash % 16);
    }

    async prewarmCache(): Promise<void> {
        await this.generateIdBatch();
    }

    getCacheSize(): number {
        return this.idCachePools.reduce((acc, pool) => acc + pool.length, 0);
    }
}