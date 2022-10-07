import { DirectSecp256k1HdWallet, EncodeObject } from '@cosmjs/proto-signing';
import { Injectable, Logger } from '@nestjs/common';
import { calculateFee, GasPrice, logs, StdFee } from '@cosmjs/stargate';
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
import { InstantiateOptions, SigningCosmWasmClient, toUtf8 } from 'cosmwasm';
import {
  MsgExecuteContract,
} from 'cosmjs-types/cosmwasm/wasm/v1/tx';

@Injectable()
export class NFTService implements INFTService {
  private readonly _logger = new Logger(NFTService.name);
  private _configService = new ConfigService();
  private _coinDenom = this._configService.get('COIN_DENOM');
  private rpcEndpoint = this._configService.get('NETWORK_TENDERMINT_URL');
  private mnemonic = this._configService.get('MNEMONIC');
  private prefix = this._configService.get('ADDRESS_PREFIX');
  maxTokensPerBatchMint = this._configService.get('MAX_TOKENS_PER_BATCH_MINT')
    ? Number(this._configService.get('MAX_TOKENS_PER_BATCH_MINT'))
    : AppConstants.MAX_TOKENS_PER_BATCH_MINT;
  network: Network;
  client: SigningCosmWasmClient;
  factoryAddress = this._configService.get('FACTORY_CONTRACT_ADDRESS');
  defaultGasPrice = this._configService.get('DEFAULT_GAS_PRICE')
    ? GasPrice.fromString(this._configService.get('DEFAULT_GAS_PRICE'))
    : GasPrice.fromString(AppConstants.DEFAULT_GAS_PRICE);

  constructor() {
    this._logger.log('============== Constructor Mint Service ==============');
    // this.startMint();
  }

  /**
   * instantiate Contract sign by mnemonic
   * @param request
   * @returns
   */
  async instantiateContractByMnemonic(
    request: MODULE_REQUEST.InstantiateContractByMnemonicRequest,
  ): Promise<ResponseDto> {
    try {
      const { tokenUri, numToken, name, symbol } = request;

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
      const { account, executeFee } = await this.prepareExecuteSignByMnemonic(this.factoryAddress, this.mnemonic, createMinterMsg);

      const result = await this.client.execute(
        account.address,
        this.factoryAddress,
        createMinterMsg,
        executeFee,
        this.mnemonic,
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
   * Mint NFT
   * @param request
   * @returns
   */

  async mintByMnemonic(request: MODULE_REQUEST.MintNftByMnemonicRequest): Promise<ResponseDto> {
    try {
      const { nftIds, contractAddress } = request;
      this._logger.log(
        `Mint Info: Contract: ${contractAddress}, ID: ${nftIds}`,
      );

      const mintBatchMsg = {
        batch_mint: { token_ids: nftIds },
      };

      const { account, executeFee } = await this.prepareExecuteSignByMnemonic(request.contractAddress, this.mnemonic, mintBatchMsg);
      const result = await this.client.execute(
        account.address,
        request.contractAddress,
        mintBatchMsg,
        executeFee,
        this.mnemonic,
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(NFTService.name, error);
    }
  }

  /**
   * instantiate Contract
   * @param request
   * @returns
   */
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

  async prepareExecuteSignByMnemonic(contract: string, mnemonic: string, message: Object): Promise<{ account: Account, executeFee: StdFee }> {
    // Wallet
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: this.prefix,
    });
    const [account] = await wallet.getAccounts();
    const address = account.address;
    // Network config
    const gasPrice = GasPrice.fromString('0.02ueaura');
    //get Client
    this.client = await SigningCosmWasmClient.connectWithSigner(
      this.rpcEndpoint,
      wallet,
      { gasPrice: gasPrice },
    );
    // TODO get creator balance

    //Estimage fee and gas
    const options: InstantiateOptions = {};

    const executeContractMsg: EncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract,
        msg: toUtf8(JSON.stringify(message)),
        funds: [...(options.funds || [])],
      }),
    };

    // Setup client
    this.client = await SigningCosmWasmClient.connectWithSigner(
      this.rpcEndpoint,
      wallet,
      { gasPrice: gasPrice },
    );

    //Read Cosmos docs, default fee would be multiple with 1.3
    const estimateGas = await this.client.simulate(address, [executeContractMsg], this.mnemonic);
    const executeFee = calculateFee(Math.round(estimateGas * 1.3), gasPrice);

    return { account, executeFee };
  }
}
