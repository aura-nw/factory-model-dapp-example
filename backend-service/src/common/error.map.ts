
export const ErrorMap = {
  SUCCESSFUL: {
    Code: 'SUCCESSFUL',
    Message: 'Successfully!',
  },
  E500: {
    Code: 'E500',
    Message: `Server error`,
  },
  UNAUTHRORIZED: {
    Code: 'E401',
    Message: `Unauthorized`,
  },
  NOT_CONNECTED_TO_IPFS: {
    Code: 'E001',
    Message: `Not connected to IPFS`,
  },
  MINT_TOKEN_FAILED: {
    Code: 'E002',
    Message: `Mint NFT failed!`,
  },
  INSERT_TOKEN_FAILED: {
    Code: 'E003',
    Message: `Insert NFT into DB failed!`,
  },
  INSERT_COLLECTION_ASSET_FAILED: {
    Code: 'E004',
    Message: `Insert collection's asset failed!`,
  },
  INSERT_TX_FAILED: {
    Code: 'E004',
    Message: `Insert Transaction into DB failed!`,
  },
  PUBKEY_NOT_BASE64: {
    Code: 'E005',
    Message: `Pubkey must be Base64 type!`,
  },
  SIGNATURE_NOT_BASE64: {
    Code: 'E006',
    Message: `Signature must be Base64 type!`,
  },
  INVALID_TIMESTAMP: {
    Code: 'E007',
    Message: `Invalid Timestamp!`,
  },
  PUBLISH_COLLECTION_FAILED: {
    Code: 'E008',
    Message: `Publish collection failed!`,
  },
  UPDATE_COLLECTION_FAILED: {
    Code: 'E009',
    Message: `Update collection failed!`,
  },
  INSERT_MOMENT_FAILED: {
    Code: 'E010',
    Message: `Insert moment failed!`,
  },
  MOMENT_NOT_EXIST: {
    Code: 'E012',
    Message: `This moment is not exist!`,
  },
  INSERT_COLLECTION_FAILED: {
    Code: 'E013',
    Message: `Insert collection failed!`,
  },
  MUST_BE_MOMENT_CREATOR: {
    Code: 'E014',
    Message: `You must be creator of this moment!`,
  },
  HAVE_MOMENT_IN_MINTING_PROCESS: {
    Code: 'E015',
    Message: `You have a moment in the process of initialization!`,
  },
  DEVIDED_UNEVENLY: {
    Code: 'E016',
    Message: `The boxes are divided unevenly!`,
  },
  NO_NFT_IN_COLLECTION: {
    Code: 'E017',
    Message: `There are no nfts in the collection!`,
  },
  NO_PACK_IN_COLLECTION: {
    Code: 'E018',
    Message: `There are no packs in the collection!`,
  },
  MUST_BE_COLLECTION_CREATOR: {
    Code: 'E019',
    Message: `You must be creator of this collection!`,
  },
  COLLECTION_MUST_BE_REVEAL: {
    Code: 'E020',
    Message: `This collection must have reveal status!`,
  },
  REVEAL_COLLECTION_FAILED: {
    Code: 'E021',
    Message: `Reveal collection failed!`,
  },
  CAN_NOT_REVEAL_COLLECTION: {
    Code: 'E022',
    Message: `Can not reveal collection!`,
  },
  HAS_DUPLICATE_ECODE: {
    Code: 'E023',
    Message: `Has duplicate ecode in list!`,
  },
  ECODE_NOT_EXIST: {
    Code: 'E024',
    Message: `eCode does not exist!`,
  },
  ECODE_USED: {
    Code: 'E025',
    Message: `eCode has been used!`,
  },
  NO_PACK_LEFT: {
    Code: 'E026',
    Message: `No pack left!`,
  },
  UPDATE_MOMENT_FAILED: {
    Code: 'E027',
    Message: `Update moment failed!`,
  },
  UNAUTHRORIZED_TO_UPDATE_MOMENT: {
    Code: 'E028',
    Message: `Unauthorized to update moment!`,
  },
  PACK_NOT_FOUND_OR_NOT_OWNED: {
    Code: 'E029',
    Message: `Pack not found or not owned!`,
  },
  ECODE_NOT_VALID: {
    Code: 'E030',
    Message: `ECode file not valid!`,
  },
  COLLECTION_NOT_VALID: {
    Code: 'E031',
    Message: `Collection not valid! (Must be in status created or reveal)`,
  },
  DO_NOT_OWN_COLLECTION: {
    Code: 'E032',
    Message: `Do not own collection!`,
  },
  INSERT_ECODE_FAILED: {
    Code: 'E033',
    Message: `Insert ecode failed!`,
  },
  DO_NOT_OWN_MOMENT: {
    Code: 'E034',
    Message: `Do not own moment!`,
  },
  COLLECTION_NOT_FOUND: {
    Code: 'E035',
    Message: `Collection not found!`,
  },
  COLLECTION_NOT_LOCK: {
    Code: 'E036',
    Message: `Status of this collection is not lock!`,
  },
  NOT_TIME_TO_OPEN_PACK: {
    Code: 'E037',
    Message: `Its not time to open the pack yet!`,
  },
  NFT_AMOUNT_INVALID: {
    Code: 'E038',
    Message: `Nft amount must > 0 and < 10000!`,
  },
  MOMENT_NOT_VALID: {
    Code: 'E039',
    Message: `Moment not valid!`,
  },
  ADDRESS_NOT_FOUND: {
    Code: 'E040',
    Message: `Address not found!`,
  },
  FIELDS_ARE_MISSING: {
    Code: 'E041',
    Message: `The operation could not be performed because required fields are missing!`,
  },
  COLLECTION_ASSET_CAN_NOT_BE_EMPTY: {
    Code: 'E042',
    Message: `Collection's assets can not be empty!`,
  },
  WRONG_FORMAT_ECODE: {
    Code: 'E043',
    Message: `Wrong type ecode file!`,
  },
  ECODE_HAS_EXISTED_IN_DB: {
    Code: 'E044',
    Message: `ECode has existed in DB!`,
  },
  OTHER_COLLECTION_HAS_REVEAL: {
    Code: 'E045',
    Message: `Has other collection has revealed!`,
  },
  COLLECTION_NOT_REVEAL: {
    Code: 'E046',
    Message: `Collection's status is not reveal!`,
  },
  COLLECTION_PACK_HAS_OPENED: {
    Code: 'E047',
    Message: `Collection's pack has opened!`,
  },
  COLLECTION_NOT_PUBLISHED: {
    Code: 'E048',
    Message: `Collection's status is not published!`,
  },
  UPDATE_NFT_FAIL: {
    Code: 'E049',
    Message: `Update NFT failed!`,
  },
  UPDATE_TX_FAIL: {
    Code: 'E050',
    Message: `Update Transaction failed!`,
  },
  GET_NFT_FAIL: {
    Code: 'E051',
    Message: `Get NFT failed!`,
  },
  GET_CREATOR_ID_FAIL: {
    Code: 'E052',
    Message: `Get Creator ID failed!`,
  },
  INSUFFICIENT_FUNDS: {
    Code: 'E053',
    Message: `Insufficient funds`,
  },
  SIMULATE_TX_FAIL: {
    Code: 'E054',
    Message: `Simulate tx failed`,
  },
  ALREADY_SOLD: {
    Code: 'E055',
    Message: `NFT already sold`,
  },
  TX_HASH_NOT_FOUND: {
    Code: 'E056',
    Message: `TX HASH NOT FOUND`,
  },
  TRANSFER_NFT_FAILED: {
    Code: 'E057',
    Message: `Transfer NFT failed!`,
  },
};
