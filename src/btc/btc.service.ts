import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { IdInfo, idTypeKeys, IdType } from './btc.model';

@Injectable()
export class BtcService {
  private readonly logger = new Logger(BtcService.name);
  constructor(private readonly httpService: HttpService) {}

  async getIdType(id: string) {
    const idTypeList = idTypeKeys;
    let idType: IdType = 'unknown';

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
  async getRawData(id: string, reqType: IdType) {
    let dataUrl = 'https://blockchain.info/';
    if (reqType == 'unknown') throw new Error('Requested type is unknown');
    else {
      dataUrl = `${dataUrl}raw${reqType}/`;
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
      data = await this.getRawData(id, 'addr');
    } catch {
      console.log('error');
    }

    return data;
  }

  async getTxInfo(id: string) {
    let data: object = {};
    try {
      data = await this.getRawData(id, 'tx');
    } catch {
      console.log('error');
    }

    return data;
  }

  async getBlockInfo(id: string) {
    let data: object = {};
    try {
      data = await this.getRawData(id, 'block');
    } catch {
      console.log('error');
    }

    return data;
  }
}
