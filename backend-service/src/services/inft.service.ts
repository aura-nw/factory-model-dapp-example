import { MODULE_REQUEST } from "../module.config";

export interface INFTService {
  /**
   * instantiate contract
   * @param request
   */
  instantiateContract(request: MODULE_REQUEST.InstantiateContractRequest);

  /**
   * mint nft
   * @param request
   */
  mint(request: MODULE_REQUEST.MintNftRequest);

  /**
   * transfer nft
   * @param request
   */
  transfer(request: MODULE_REQUEST.TransferNftRequest);

  /**
   * sign msg
   * @param request
   */
   mintByMnemonic(request: MODULE_REQUEST.MintNftByMnemonicRequest);
}
