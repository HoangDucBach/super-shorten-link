// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DatabaseStreamType } from 'src/domains/config/database.interface'; // Đảm bảo import đúng đường dẫn
import { RedisHealthIndicator } from './cache.health';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        @InjectConnection(DatabaseStreamType.WRITE)
        private writeConnection: Connection,

        @InjectConnection(DatabaseStreamType.READ)
        private readConnection: Connection,

        private redisHealthIndicator: RedisHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.db.pingCheck('database-write', { connection: this.writeConnection }),
            () => this.db.pingCheck('database-read', { connection: this.readConnection }),
            () => this.redisHealthIndicator.isHealthy('redis'),
        ]);
    }
}