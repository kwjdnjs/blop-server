import { Controller, Get, Param, Query } from '@nestjs/common';
import { query } from 'express';
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
    return this.btcService.getData(id, 'addr', false);
  }

  @Get('tx/:id')
  getTxInfo(@Param('id') id: string, @Query('light') isLight: boolean) {
    return this.btcService.getData(id, 'tx', isLight);
  }

  @Get('block/:id')
  getBlockInfo(@Param('id') id: string) {
    return this.btcService.getData(id, 'block', false);
  }
}
