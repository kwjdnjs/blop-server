export interface IdInfo {
  network: string;
  id: string;
  type: IdType;
}

export const idTypeKeys = ['addr', 'tx', 'block', 'unknown'] as const;
export type IdType = (typeof idTypeKeys)[number];
