import { Test, TestingModule } from '@nestjs/testing';
import { BtcController } from './btc.controller';
import { BtcService } from './btc.service';

describe('BtcController', () => {
  let controller: BtcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcController],
      providers: [BtcService],
    }).compile();

    controller = module.get<BtcController>(BtcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
