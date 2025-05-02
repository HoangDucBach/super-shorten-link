import { Test, TestingModule } from '@nestjs/testing';
import { ShortIdGenService } from './short-id-gen.service';

describe('ShortIdGenService', () => {
  let service: ShortIdGenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortIdGenService],
    }).compile();

    service = module.get<ShortIdGenService>(ShortIdGenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
