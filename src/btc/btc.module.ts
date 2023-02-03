import { Module } from '@nestjs/common';
import { BtcService } from './btc.service';
import { BtcController } from './btc.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BtcController],
  providers: [BtcService],
})
export class BtcModule {}
