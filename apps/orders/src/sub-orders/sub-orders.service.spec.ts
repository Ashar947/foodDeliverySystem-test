import { Test, TestingModule } from '@nestjs/testing';
import { SubOrdersService } from './sub-orders.service';

describe('SubOrdersService', () => {
  let service: SubOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubOrdersService],
    }).compile();

    service = module.get<SubOrdersService>(SubOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
