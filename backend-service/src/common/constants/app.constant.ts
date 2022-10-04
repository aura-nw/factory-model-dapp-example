export enum ORDER_BY {
  DESC = 'DESC',
  ASC = 'ASC',
}
export enum DATABASE_TYPE {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}

export enum NFT_STATUS {
  PENDING = 'pending',
  CREATED = 'created',
}

export enum ASSET_STATUS {
  ACTIVE = 'ACTIVE',
  NOT_ACTIVE = 'NOT_ACTIVE',
}

export enum COLLECTION_STATUS {
  CREATED = 'CREATED',
  RELEASED = 'RELEASED',
  OPENING = 'OPENING',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

export enum AppConstants {
  DEFAULT_GAS_PRICE = '0.0002uaura',
  AUTO = 'auto',
  DEFAULT_AMOUNT_FUND = 233444,
  DEFAULT_DENOM_FUND = 'uaura',
  DEFAULT_DENOM = 'uaura',
  INSUFFICIENT_FUNDS = 'insufficient funds',
  ALREADY_SOLD = 'already sold',
  MAX_TOKENS_PER_BATCH_MINT = 20,
  LENGTH_IN_BYTES = 32,
}

export enum TX_CODE {
  NFT_ALREADY_EXISTS = 5,
}
