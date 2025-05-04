import { Injectable, Logger, Inject } from '@nestjs/common';
import { DistributedCounterService } from '../distributed-counter/distributed-counter.service';

@Injectable()
export class ShortIdGenService {
    private readonly logger = new Logger(ShortIdGenService.name);

    constructor(
        private readonly counterService: DistributedCounterService
    ) {
        this.logger.log('ShortIdGenService initialized.');
    }

    async generateShortId(): Promise<string> {
        try {
            const uniqueNumber = await this.counterService.getNextCounterValue();
            const shortId = this.toBase62(uniqueNumber);
            return shortId;
        } catch (error) {
            throw new Error(`Failed to generate unique short ID: ${error.message}`);
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
}
