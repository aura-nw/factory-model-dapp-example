import { DirectSecp256k1HdWallet, EncodeObject } from '@cosmjs/proto-signing';
import { Injectable, Logger } from '@nestjs/common';
import { GasPrice, logs, SignerData, SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { INFTService } from '../inft.service';
import { ConfigService } from '../../shared/services/config.service';
import { AppConstants } from '../../common/constants/app.constant';
import { Network } from '../../utils/network.utils';
import { KMSSigner } from '../../utils/kms.utils';
import { CustomError } from '../../common/customError';
import { ErrorMap } from '../../common/error.map';
import { MODULE_REQUEST } from '../../module.config';
import { ResponseDto } from '../../dtos/responses';
import { Account } from '../../utils/interface.utils';
import {
  InstantiateOptions,
  SigningCosmWasmClient,
} from 'cosmwasm';
import { assert } from '@cosmjs/utils';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8, fromBase64, toHex } from '@cosmjs/encoding';
import { coins } from '@cosmjs/proto-signing';

@Injectable()
export class NFTService implements INFTService {
  private readonly _logger = new Logger(NFTService.name);
  private _configService = new ConfigService();
  private _coinDenom = this._configService.get('COIN_DENOM');
  private rpcEndpoint = this._configService.get('NETWORK_TENDERMINT_URL');
  maxTokensPerBatchMint = this._configService.get('MAX_TOKENS_PER_BATCH_MINT')
    ? Number(this._configService.get('MAX_TOKENS_PER_BATCH_MINT'))
    : AppConstants.MAX_TOKENS_PER_BATCH_MINT;
  network: Network;
  factoryAddress = this._configService.get('FACTORY_CONTRACT_ADDRESS');
  defaultGasPrice = this._configService.get('DEFAULT_GAS_PRICE')
    ? GasPrice.fromString(this._configService.get('DEFAULT_GAS_PRICE'))
    : GasPrice.fromString(AppConstants.DEFAULT_GAS_PRICE);
  

  constructor() {
    this._logger.log('============== Constructor Mint Service ==============');
    // this.startMint();
  }

  /**
   * Instantiate Contract by CodeID
   * @param request
   * @returns
   */

  async signByMnemonic(
    request: MODULE_REQUEST.SignMsgRequest,
  ): Promise<ResponseDto> {
    try {
      // Wallet
      const mnemonic =
        'tenant weather comfort fun seminar lucky salt city palm below clever fuel renew gap melt glove attack zone brand food rain friend plunge vessel';
      const prefix = 'aura';
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: prefix,
      });
      const [account] = await wallet.getAccounts();
      const address = account.address;

      // Network config
      const gasPrice = GasPrice.fromString('0.0002utaura');
      const gasLimit = 100000;
      const fee = {
        amount: coins(1, 'utaura'),
        gas: gasLimit.toString(),
      };

      // Setup client
      const client = await SigningCosmWasmClient.connectWithSigner(
        this.rpcEndpoint,
        wallet,
        { gasPrice: gasPrice },
      );

      //Get sequence, chainId and account number 
      let accountOnChain = await client.getAccount(address);  

      const signerData: SignerData = {
        accountNumber: accountOnChain.accountNumber,
        sequence: accountOnChain.sequence,
        chainId: await client.getChainId(),
      };

      //Create execute msg
      const options: InstantiateOptions = {};

      const executeContractMsg: EncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: address,
          contract: request.contractAddress,
          msg: toUtf8(JSON.stringify(request.msg)),
          funds: [...(options.funds || [])],
        }),
      };

      const executeMsg = [executeContractMsg];

      const { bodyBytes: bb, signatures } = await client.sign(
        address,
        executeMsg,
        fee,
        '',
        signerData,
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, signatures);

    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(NFTService.name, error);
    }
  }

  async instantiateContract(
    request: MODULE_REQUEST.InstantiateContractRequest,
  ): Promise<ResponseDto> {
    try {
      const { operatorAddress, tokenUri, numToken, name, symbol } = request;
      let account = await this.prepareExecute(operatorAddress);
      const createMinterMsg = {
        create_minter: {
          minter_instantiate_msg: {
            base_token_uri: tokenUri,
            name,
            symbol,
            num_tokens: numToken,
            max_tokens_per_batch_mint: this.maxTokensPerBatchMint,
            max_tokens_per_batch_transfer: this.maxTokensPerBatchMint,
          },
        },
      };
      const fee = AppConstants.AUTO;
      const result = await this.network.execute(
        account.address,
        this.factoryAddress,
        createMinterMsg,
        fee,
      );
      const contractAddress = logs.findAttribute(
        result.logs,
        'instantiate',
        '_contract_address',
      );
      this._logger.log(
        `Instantiate contract completed: ${result.transactionHash}, contract: ${contractAddress.value}`,
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, {
        minter: `${contractAddress.value}`,
      });
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(NFTService.name, error);
    }
  }

  /**
   * mint nft
   * @param request
   * @returns
   */
  async mint(request: MODULE_REQUEST.MintNftRequest): Promise<ResponseDto> {
    try {
      const { nftIds, operatorAddress, contractAddress } = request;
      this._logger.log(
        `Mint Info: Contract: ${contractAddress}, ID: ${nftIds}`,
      );

      let account = await this.prepareExecute(operatorAddress);
      const mintBatchMsg = {
        batch_mint: { token_ids: nftIds },
      };
      const fee = AppConstants.AUTO;

      const result = await this.network.execute(
        account.address,
        contractAddress,
        mintBatchMsg,
        fee,
      );
      if (result.code === 0) {
        this._logger.log(
          `Result mint nftId ${nftIds}: ${JSON.stringify(result)}`,
        );
      } else {
        this._logger.error(
          `Result mint nftId ${nftIds} error: ${JSON.stringify(result)}`,
        );
        throw new CustomError(ErrorMap.MINT_TOKEN_FAILED);
      }
      this._logger.log(`Completed: ${JSON.stringify(result)}`);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {
        result: `${JSON.stringify(result)}`,
      });
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(NFTService.name, error);
    }
  }

  /**
   * transfer nft
   * @param request
   * @returns
   */
  async transfer(
    request: MODULE_REQUEST.TransferNftRequest,
  ): Promise<ResponseDto> {
    try {
      const { nftId, operatorAddress, contractAddress, recipient } = request;
      this._logger.log(
        `Transfer Info: Contract: ${contractAddress}, ID: ${nftId}`,
      );

      let account = await this.prepareExecute(operatorAddress);
      // const queryMsg = AppConstants.GET_MINTER_CONFIG_BASE64;
      const queryMsg = { get_config: {} };
      const queryResult = await this.network.queryContractSmart(
        contractAddress,
        queryMsg,
      );
      const nft_contract_addess = queryResult.cw721_address;
      const transferMsg = {
        transfer_nft: {
          recipient,
          token_id: nftId.toString(),
        },
      };
      const fee = AppConstants.AUTO;

      const result = await this.network.execute(
        account.address,
        // recipient,
        nft_contract_addess,
        transferMsg,
        fee,
      );
      if (result.code === 0) {
        this._logger.log(
          `Result transfer nftId ${nftId}: ${JSON.stringify(result)}`,
        );
      } else {
        this._logger.error(
          `Result mint nftId ${nftId} error: ${JSON.stringify(result)}`,
        );
        throw new CustomError(ErrorMap.TRANSFER_NFT_FAILED);
      }
      this._logger.log(`Completed: ${JSON.stringify(result)}`);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {
        result: `${JSON.stringify(result)}`,
      });
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(NFTService.name, error);
    }
  }

  async getBalance(address: string) {
    const balance = await this.network.getBalance(address, this._coinDenom);
    return balance;
  }

  async prepareExecute(executorAddress: string): Promise<Account> {
    // get signer
    const signer = new KMSSigner(executorAddress);

    // get system address info
    const account = await signer.getAccount();

    // connect network
    this.network = await Network.connectWithSigner(
      this._configService.get('RPC'),
      account,
      signer,
      { gasPrice: this.defaultGasPrice },
    );

    // get creator balance
    const balance = await this.getBalance(account.address);
    if (balance.amount === '0')
      throw new CustomError(ErrorMap.INSUFFICIENT_FUNDS);

    return account;
  }
}
