// src/short-id-gen/short-id-gen.module.ts

import { Module } from '@nestjs/common';
import { ShortIdGenService } from './short-id-gen.service'; // Import service của module này
// Import module chứa DistributedCounterService.
// Sử dụng registerAsync() vì DistributedCounterModule là Dynamic Module và cần cấu hình bất đồng bộ.
import { DistributedCounterModule } from '../distributed-counter/distributed-counter.module';
// Import ConfigModule nếu ShortIdGenModule cũng cần truy cập cấu hình trực tiếp,
// hoặc nếu DistributedCounterModule.registerAsync() yêu cầu nó được cung cấp ở đây.
// (Trong trường hợp DistributedCounterModule.registerAsync() cần ConfigService,
// nó sẽ tự import ConfigModule, nên bạn không cần import lại ở đây trừ khi ShortIdGenModule
// có dependencies khác cần ConfigService).
// import { ConfigModule } from '@nestjs/config';


/**
 * Module responsible for generating unique short IDs.
 * It depends on the DistributedCounterModule to get unique numbers.
 */
@Module({
  imports: [
    // Import DistributedCounterModule bằng cách gọi phương thức registerAsync().
    // Điều này đảm bảo các providers (bao gồm DistributedCounterService) từ module đó
    // được load vào context của ứng dụng và có thể được inject.
    DistributedCounterModule.registerAsync(),

    // Thêm các imports khác nếu ShortIdGenModule có dependencies khác.
    // Ví dụ: Nếu ShortIdGenService cần ConfigService, bạn sẽ import ConfigModule ở đây.
    // ConfigModule,
  ],
  providers: [
    // Định nghĩa ShortIdGenService như một provider trong module này.
    // NestJS sẽ tự động inject dependencies của nó (DistributedCounterService)
    // từ các imports đã khai báo.
    ShortIdGenService,
  ],
  exports: [
    // Export ShortIdGenService để các module khác có thể inject và sử dụng nó.
    ShortIdGenService,
  ],
})
export class ShortIdGenModule {}
