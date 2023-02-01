import { Module } from '@nestjs/common';
import { BtcModule } from './btc/btc.module';

@Module({
  imports: [BtcModule],
})
export class AppModule {}
