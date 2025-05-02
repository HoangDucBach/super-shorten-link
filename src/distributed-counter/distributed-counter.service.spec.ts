import { Test, TestingModule } from '@nestjs/testing';
import { DistributedCounterService } from './distributed-counter.service';

describe('DistributedCounterService', () => {
  let service: DistributedCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributedCounterService],
    }).compile();

    service = module.get<DistributedCounterService>(DistributedCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
