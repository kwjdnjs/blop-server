import { Controller, Get, Param } from '@nestjs/common';
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
    return this.btcService.getData(id, 'addr');
  }

  @Get('tx/:id')
  getTxInfo(@Param('id') id: string) {
    return this.btcService.getData(id, 'tx');
  }

  @Get('block/:id')
  getBlockInfo(@Param('id') id: string) {
    return this.btcService.getData(id, 'block');
  }
}
