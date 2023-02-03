export interface IdInfo {
  network: string;
  id: string;
  type: IdTypes;
}

export enum IdTypes {
  ADDR = 'ADDR',
  TX = 'TX',
  BLOCK = 'BLOCK',
  UNKNOWN = 'UNKNOWN',
}
