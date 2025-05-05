import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShortIdGenService {
    private readonly logger = new Logger(ShortIdGenService.name);
    private readonly BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private readonly BASE = this.BASE62_CHARS.length;
    private readonly MIN_LENGTH = 7;

    private lastTimestamp: number = -1;
    private sequence: number = 0;
    private readonly SEQUENCE_BITS = 12;
    private readonly MAX_SEQUENCE = (1 << this.SEQUENCE_BITS) - 1;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.logger.verbose(`ShortIdGenService initialized (Timestamp + Sequence). Min length: ${this.MIN_LENGTH}, Sequence Bits: ${this.SEQUENCE_BITS}`);
    }

    generateShortId(): string {
        let currentTimestamp = Date.now();

        if (currentTimestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1);

            if (this.sequence > this.MAX_SEQUENCE) {
                this.logger.warn(`Sequence overflow at timestamp ${currentTimestamp}. Waiting for next millisecond.`);
                while (currentTimestamp <= this.lastTimestamp) {
                    currentTimestamp = Date.now();
                }
                this.sequence = 0;
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = currentTimestamp;

        const uniqueNumber = (BigInt(currentTimestamp) << BigInt(this.SEQUENCE_BITS)) | BigInt(this.sequence);

        const encodedId = this.toBase62(uniqueNumber);
        return encodedId;
    }

    private toBase62(num: bigint): string {
        if (num === 0n) {
            return this.BASE62_CHARS[0].padStart(this.MIN_LENGTH, this.BASE62_CHARS[0]);
        }

        let encoded = '';
        let value = num;
        const bigIntBase = BigInt(this.BASE);

        while (value > 0n) {
            const remainder = Number(value % bigIntBase);
            encoded = this.BASE62_CHARS[remainder] + encoded;
            value = value / bigIntBase;
        }

        while (encoded.length < this.MIN_LENGTH) {
            encoded = this.BASE62_CHARS[0] + encoded;
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
