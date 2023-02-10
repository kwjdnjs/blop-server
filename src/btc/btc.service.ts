import { ElectrumClient } from '@gemlinkofficial/electrum-client-ts';
import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { address } from 'bitcoinjs-lib';
import { sha256 } from 'bitcoinjs-lib/src/crypto';
import { IdInfo, idTypeKeys, IdType, Data } from './btc.model';

@Injectable()
export class BtcService {
  private readonly logger = new Logger(BtcService.name);
  constructor(private readonly httpService: HttpService) {}

  // get data from electrum json rpc
  async getRawData(id: string, reqType: IdType) {
    const client = new ElectrumClient('electrum.bitaroo.net', 50002, 'ssl');
    await client.connect(
      'electrum-client-js', // optional client name
      '1.4.2', // optional protocol version
    );

    let data = {};

    if (reqType == 'addr') {
      const script = address.toOutputScript(id);
      const hash = sha256(script).reverse();
      data['tx_hashes'] = await client.blockchain_scripthash_getHistory(
        hash.toString('hex'),
      );
      data['tx_hashes'] = data['tx_hashes'].reverse();
    } else if (reqType == 'tx') {
      data = await client.blockchain_transaction_get(id, true);
    } else if (reqType == 'block') {
      data = await client.blockchain_block_header(id, parseInt(id) + 1);
    } else {
      await client.close();
      throw new Error('unknown type error');
    }

    await client.close();
    return data;
  }

  async getIdType(id: string) {
    const idTypeList = idTypeKeys;
    const idInfo: IdInfo = { network: 'btc', id, idType: 'unknown' };

    for (const i in idTypeList) {
      try {
        await this.getRawData(id, idTypeList[i]);
        idInfo['idType'] = idTypeList[i];
        break;
      } catch {
        //console.log('error');
      }
    }
    return idInfo;
  }

  async getData(id: string, idType: IdType) {
    const idInfo: IdInfo = { network: 'btc', id, idType };
    const data: Data = { idInfo, data: {} };
    try {
      data['data'] = await this.getRawData(id, idType);
    } catch {
      return { error: 'unknown type error' };
    }

    return data;
  }
}
