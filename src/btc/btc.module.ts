import { Module } from '@nestjs/common';
import { BtcService } from './btc.service';
import { BtcController } from './btc.controller';

@Module({
  controllers: [BtcController],
  providers: [BtcService],
})
export class BtcModule {}
