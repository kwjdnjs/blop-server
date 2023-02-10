export interface IdInfo {
  network: string;
  id: string;
  idType: IdType;
}

export interface Data {
  idInfo: IdInfo;
  data: object;
}

export const idTypeKeys = ['addr', 'tx', 'block', 'unknown'] as const;
export type IdType = (typeof idTypeKeys)[number];
