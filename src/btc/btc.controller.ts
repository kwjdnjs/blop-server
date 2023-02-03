import { Controller, Get, Param } from '@nestjs/common';
import { IdInfo } from './btc.model';
import { BtcService } from './btc.service';

@Controller('btc')
export class BtcController {
  constructor(private readonly btcService: BtcService) {}

  @Get('type/:id')
  getIdType(@Param('id') id: string) {
    return this.btcService.getIdType(id);
  }

  @Get('addr/:id')
  getAddrInfo(@Param('id') id: string) {
    return this.btcService.getAddrInfo(id);
  }

  @Get('tx/:id')
  getTxInfo(@Param('id') id: string) {
    return this.btcService.getTxInfo(id);
  }

  @Get('block/:id')
  getBlockInfo(@Param('id') id: string) {
    return this.btcService.getBlockInfo(id);
  }
}
