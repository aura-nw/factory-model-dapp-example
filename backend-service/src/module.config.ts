
import { ConnectKMSParam, SignKMSParam, SignKMSRequest } from "./dtos/request/kms";

import {
  MintNftRequest,
  TransferNftRequest,
  InstantiateContractRequest
} from './dtos/request/nft';
import { Simuate } from "./dtos/request/kms/simulate.request";
import { ResponseDto } from './dtos/responses';
import { MintNftByMnemonicRequest } from "./dtos/request/sign/sign.request.dto";

export const ENTITIES_CONFIG = {
 
};

export const REQUEST_CONFIG = {
  INS_CONTRACT_REQUEST: InstantiateContractRequest,
  MINT_NFT_REQUEST: MintNftRequest,
  TRANSFER_NFT_REQUEST: TransferNftRequest,
  CONNECT_KMS_PARAM: ConnectKMSParam,
  SIGN_KMS_PARAM: SignKMSParam,
  SIGN_KMS_REQUEST: SignKMSRequest,
  MINT_NFT_BY_MNEMONIC_REQUEST: MintNftByMnemonicRequest,
};

export const REQUEST_PARAM = {
};

export const REQUEST_QUERY = {
};

export const RESPONSE_CONFIG = {
  RESPONSE_DTO: ResponseDto,
};

export namespace MODULE_REQUEST {
  export abstract class InstantiateContractRequest extends REQUEST_CONFIG.INS_CONTRACT_REQUEST { }
  export abstract class MintNftRequest extends REQUEST_CONFIG.MINT_NFT_REQUEST { }
  export abstract class TransferNftRequest extends REQUEST_CONFIG.TRANSFER_NFT_REQUEST { }
  export abstract class ConnectKMSParam extends REQUEST_CONFIG.CONNECT_KMS_PARAM { }
  export abstract class SignKMSParam extends REQUEST_CONFIG.SIGN_KMS_PARAM { }
  export abstract class SignKMSRequest extends REQUEST_CONFIG.SIGN_KMS_REQUEST { }
  export abstract class MintNftByMnemonicRequest extends REQUEST_CONFIG.MINT_NFT_BY_MNEMONIC_REQUEST { }
}

export namespace MODULE_PARAM {
}

export namespace MODULE_QUERY {
}

export namespace MODULE_RESPONSE {
  export abstract class ResponseDto extends RESPONSE_CONFIG.RESPONSE_DTO { }
}

export const SERVICE_INTERFACE = {
  INFT_SERVICE: 'INftService',
  IKMS_SERVICE: 'IKMSService',
};

export const REPOSITORY_INTERFACE = {
};

export const PROVIDER_INTERFACE = {};
