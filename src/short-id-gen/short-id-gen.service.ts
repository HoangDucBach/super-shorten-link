// src/short-id-gen/short-id-gen.service.ts

import { Injectable, Logger, Inject } from '@nestjs/common';
// Import service cần inject.
// Không cần import Module class ở đây.
import { DistributedCounterService } from '../distributed-counter/distributed-counter.service';
// Không cần import token tùy chỉnh nếu DistributedCounterModule export service class trực tiếp.
// import { DistributedCounterModule } from '../distributed-counter/distributed-counter.module';


/**
 * Service responsible for generating unique short IDs.
 * It uses the DistributedCounterService to get a unique base number
 * and then encodes it into a short string.
 */
@Injectable()
export class ShortIdGenService {
    private readonly logger = new Logger(ShortIdGenService.name);

    /**
     * Injects the DistributedCounterService.
     * NestJS can inject this service by type because it's provided and exported
     * by the imported DistributedCounterModule.
     * @param counterService The injected DistributedCounterService instance.
     */
    constructor(
        // Inject DistributedCounterService bằng cách khai báo kiểu dữ liệu.
        // NestJS sẽ tìm provider phù hợp trong context của module.
        private readonly counterService: DistributedCounterService
        // Nếu DistributedCounterModule export service dưới một token tùy chỉnh,
        // bạn sẽ cần dùng @Inject(TOKEN_CỦA_SERVICE) ở đây.
        // Ví dụ: @Inject(DistributedCounterModule.DISTRIBUTED_COUNTER_SERVICE) private readonly counterService: DistributedCounterService
    ) {
        this.logger.log('ShortIdGenService initialized.');
    }

    /**
     * Generates a unique short ID.
     * It obtains a unique number from the distributed counter and encodes it using Base62.
     * @returns A promise that resolves to a unique short ID string.
     * @throws Error if unable to get a unique number from the counter service.
     */
    async generateShortId(): Promise<string> {
        try {
            // Lấy số nguyên duy nhất từ DistributedCounterService.
            // Số này đã được đảm bảo tính duy nhất bởi logic counter sharding trên Redis.
            const uniqueNumber = await this.counterService.getNextCounterValue();

            // Mã hóa số duy nhất này sang chuỗi Base62.
            // Sử dụng hàm toBase62 đã sửa để không cắt chuỗi.
            const shortId = this.toBase62(uniqueNumber);

            this.logger.debug(`Generated unique number: ${uniqueNumber}, Short ID: ${shortId}`);

            return shortId;

        } catch (error) {
            this.logger.error('Failed to generate short ID from counter service', error);
            // Ném lỗi để logic gọi (Use Case) biết việc tạo ID thất bại.
            throw new Error(`Failed to generate unique short ID: ${error.message}`);
        }
    }

    /**
     * Encodes a number into a Base62 string.
     * This version ensures the full encoded string is returned and can pad to a minimum length.
     * @param num The number to encode.
     * @returns The Base62 encoded string.
     */
    private toBase62(num: number): string {
        const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const BASE = CHARS.length;
        let value = num;

        // Xử lý trường hợp đặc biệt cho số 0
        if (value === 0) {
            // Quyết định cách mã hóa số 0. '0' là phổ biến.
            // Nếu bạn muốn độ dài tối thiểu ngay cả với 0, hãy padding ở đây.
            // Ví dụ: return CHARS[0].repeat(MIN_LENGTH);
            return CHARS[0];
        }

        let encoded = '';
        // Mã hóa số lớn hơn 0
        while (value > 0) {
            encoded = CHARS[value % BASE] + encoded;
            value = Math.floor(value / BASE);
        }

        // Tùy chọn: Padding bằng ký tự '0' ở đầu nếu muốn độ dài tối thiểu.
        // Độ dài tối thiểu 7 ký tự như trong code gốc của bạn.
        const MIN_LENGTH = 7;
        while (encoded.length < MIN_LENGTH) {
            encoded = CHARS[0] + encoded;
        }

        // Trả về chuỗi đã mã hóa và padding. KHÔNG CẮT CHUỖI.
        // Độ dài tối đa sẽ phụ thuộc vào giá trị lớn nhất từ counter và MIN_LENGTH.
        // Với schema VARCHAR(12), bạn có thể chấp nhận chuỗi dài tới 12.
        return encoded;
    }

    /**
     * Calculates the potential partition number for a given short ID
     * based on a hash function and the total number of partitions (16).
     * NOTE: This function is typically NOT needed at the application layer
     * when using PostgreSQL's HASH partitioning, as the database handles routing.
     * It might be useful for debugging or specific manual routing scenarios.
     * @param shortId The short ID string.
     * @returns The calculated partition number (0-15).
     */
    getPartitionNumber(shortId: string): number {
        let hash = 0;
        for (let i = 0; i < shortId.length; i++) {
            const char = shortId.charCodeAt(i);
            // Simple hash function (djb2 or similar)
            hash = ((hash << 5) - hash) + char;
            // Convert to 32bit integer
            hash = hash & hash;
        }
        // Ensure positive result and get remainder
        return Math.abs(hash % 16); // Sử dụng 16 tương ứng với số partition HASH trong DB
    }
}
