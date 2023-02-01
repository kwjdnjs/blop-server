import { Injectable } from '@nestjs/common';

@Injectable()
export class BtcService {
  getIdType(id: string): object {
    const idType: string[] = ['tx'];

    return { network: 'btc', id: id, type: idType };
  }

  getAddrInfo(id: string): object {
    const txData: string[] = ['data1'];

    return { network: 'btc', id: id, tx: txData };
  }

  getTxInfo(id: string): object {
    const txData: string[] = ['data1'];

    return { network: 'btc', id: id, tx: txData };
  }

  getBlockInfo(id: string): object {
    const blockData = 'data';

    return { network: 'btc', id: id, tx: blockData };
  }
}
