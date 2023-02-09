import { ElectrumClient } from '@gemlinkofficial/electrum-client-ts';
import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { address } from 'bitcoinjs-lib';
import { sha256 } from 'bitcoinjs-lib/src/crypto';
import { catchError, firstValueFrom } from 'rxjs';
import { IdInfo, idTypeKeys, IdType } from './btc.model';

@Injectable()
export class BtcService {
  private readonly logger = new Logger(BtcService.name);
  constructor(private readonly httpService: HttpService) {}

  async testEle() {
    const client = new ElectrumClient('electrum.bitaroo.net', 50002, 'ssl');

    try {
      await client.connect(
        'electrum-client-js', // optional client name
        '1.4.2', // optional protocol version
      );

      const addr = '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F';
      const script = address.toOutputScript(addr);
      const hash = sha256(script).reverse();
      const header = await client.blockchain_scripthash_getHistory(
        hash.toString('hex'),
      );
      await client.close();
      return header;
    } catch (err) {
      return err;
    }
  }

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
