import { Test, TestingModule } from '@nestjs/testing';
import { SubOrdersController } from './sub-orders.controller';
import { SubOrdersService } from './sub-orders.service';

describe('SubOrdersController', () => {
  let controller: SubOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubOrdersController],
      providers: [SubOrdersService],
    }).compile();

    controller = module.get<SubOrdersController>(SubOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
