import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { IdInfo, IdTypes } from './btc.model';

@Injectable()
export class BtcService {
  private readonly logger = new Logger(BtcService.name);
  constructor(private readonly httpService: HttpService) {}

  async getIdType(id: string) {
    const idTypeList: IdTypes[] = [IdTypes.ADDR, IdTypes.TX, IdTypes.BLOCK];
    let idType: IdTypes = IdTypes.UNKNOWN;

    for (const i in idTypeList) {
      try {
        await this.getRawData(id, idTypeList[i]);
        idType = idTypeList[i];
      } catch {
        //console.log('error');
      }
    }

    const idInfo: IdInfo = { network: 'btc', id: id, type: idType };
    return idInfo;
  }

  // get data from external api
  async getRawData(id: string, reqType: IdTypes) {
    let dataUrl = 'https://blockchain.info/';

    switch (reqType) {
      case IdTypes.ADDR:
        dataUrl += 'rawaddr/';
        break;
      case IdTypes.TX:
        dataUrl += 'rawtx/';
        break;
      case IdTypes.BLOCK:
        dataUrl += 'rawblock/';
        break;
      case IdTypes.UNKNOWN:
        throw new Error('Requested type is unknown');
    }

    const DATA_URL = dataUrl + id;
    const { data } = await firstValueFrom(
      this.httpService.get(DATA_URL).pipe(
        catchError((error) => {
          //this.logger.error(error.response.data);
          throw false;
        }),
      ),
    );
    return data;
  }

  async getAddrInfo(id: string) {
    let data: object = {};
    try {
      data = await this.getRawData(id, IdTypes.ADDR);
    } catch {
      console.log('error');
    }

    return data;
  }

  async getTxInfo(id: string) {
    let data: object = {};
    try {
      data = await this.getRawData(id, IdTypes.TX);
    } catch {
      console.log('error');
    }

    return data;
  }

  async getBlockInfo(id: string) {
    let data: object = {};
    try {
      data = await this.getRawData(id, IdTypes.BLOCK);
    } catch {
      console.log('error');
    }

    return data;
  }
}
