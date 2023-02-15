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
  async getRawData(id: string, reqType: IdType, isLight: boolean) {
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
      const tx_data = await client.blockchain_transaction_get(id, true);

      // vin
      const vin = tx_data['vin'];
      const fullVinList = [];
      for (const i in vin) {
        const prevTx = await client.blockchain_transaction_get(
          vin[i]['txid'],
          true,
        );

        const fullVin = prevTx['vout'][vin[i]['vout']];
        if (isLight) {
          fullVin['addresses'] = fullVin['scriptPubKey']['addresses'];
          delete fullVin.scriptPubKey;
        } else {
          fullVin['scriptSig'] = vin[i]['scriptSig'];
          fullVin['sequence'] = vin[i]['sequence'];
        }
        fullVinList.push(fullVin);
      }
      data['vin'] = fullVinList;

      // vout
      const vout = tx_data['vout'];
      if (isLight) {
        for (const i in vout) {
          vout[i]['addresses'] = vout[i]['scriptPubKey']['addresses'];
          delete vout[i].scriptPubKey;
        }
      }
      data['vout'] = vout;
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
        await this.getRawData(id, idTypeList[i], false);
        idInfo['idType'] = idTypeList[i];
        break;
      } catch {
        //console.log('error');
      }
    }
    return idInfo;
  }

  async getData(id: string, idType: IdType, isLight: boolean) {
    const idInfo: IdInfo = { network: 'btc', id, idType };
    const data: Data = { idInfo, data: {} };
    try {
      data['data'] = await this.getRawData(id, idType, isLight);
    } catch (e) {
      return { error: 'unknown type error' };
    }

    return data;
  }
}
