// rate-limit.module.ts
import { Module } from '@nestjs/common';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { RateLimitingType } from 'src/domains/config/database.interface';
import { EnvironmentConfigModule } from 'src/infrastructures/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructures/config/environment-config/environment-config.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [EnvironmentConfigModule],
            inject: [EnvironmentConfigService],
            useFactory: async (config: EnvironmentConfigService) => ({
                throttlers: [
                    {
                        name: 'short',
                        ttl: seconds(config.getRateLimitingTtl(RateLimitingType.SHORT)),
                        limit: config.getRateLimitingLimit(RateLimitingType.SHORT),
                    },
                    {
                        name: 'medium',
                        ttl: seconds(config.getRateLimitingTtl(RateLimitingType.MEDIUM)),
                        limit: config.getRateLimitingLimit(RateLimitingType.MEDIUM),
                    },
                    {
                        name: 'long',
                        ttl: seconds(config.getRateLimitingTtl(RateLimitingType.LONG)),
                        limit: config.getRateLimitingLimit(RateLimitingType.LONG),
                    },
                ],
            }),
        }),
    ],
})
export class RateLimitingModule { }