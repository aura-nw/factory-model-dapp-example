import { Int53, Uint53 } from '@cosmjs/math';
import { assertDefined } from '@cosmjs/utils';
import { toUtf8, fromBase64, toHex } from '@cosmjs/encoding';
import {
  CosmWasmClient,
  MsgInstantiateContractEncodeObject,
  MsgStoreCodeEncodeObject,
  UploadResult,
  InstantiateOptions,
  InstantiateResult,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate';
import {
  DeliverTxResponse,
  SignerData,
  StdFee,
  defaultRegistryTypes as defaultStargateTypes,
  logs,
  isDeliverTxFailure,
  TimeoutError,
  calculateFee,
} from '@cosmjs/stargate';
import { gzip } from 'pako';
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import {
  EncodeObject,
  encodePubkey,
  GeneratedType,
  makeAuthInfoBytes,
  makeSignDoc,
  Registry,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey, encodeSecp256k1Signature } from '@cosmjs/amino';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { sha256 } from '@cosmjs/crypto';
import { fromString } from 'long';
import { KMSSigner } from './kms.utils';
import {
  Account,
  ExecuteContractResult,
  SigningCosmWasmClientOptions,
} from './interface.utils';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { Logger } from '@nestjs/common';
import { isCustomError } from './common.util';
import { AppConstants } from '../common/constants/app.constant';
import { CustomError } from '../common/customError';
import { ErrorMap } from '../common/error.map';
import { ripemd160, Secp256k1 } from '@cosmjs/crypto';
import { toBech32 } from '@cosmjs/encoding';
import { ConfigService } from '../shared/services/config.service';
import * as asn1 from 'asn1.js';


const wasmTypes: ReadonlyArray<[string, GeneratedType]> = [
  ['/cosmwasm.wasm.v1.MsgClearAdmin', MsgClearAdmin],
  ['/cosmwasm.wasm.v1.MsgExecuteContract', MsgExecuteContract],
  ['/cosmwasm.wasm.v1.MsgMigrateContract', MsgMigrateContract],
  ['/cosmwasm.wasm.v1.MsgStoreCode', MsgStoreCode],
  ['/cosmwasm.wasm.v1.MsgInstantiateContract', MsgInstantiateContract],
  ['/cosmwasm.wasm.v1.MsgUpdateAdmin', MsgUpdateAdmin],
];

function createDefaultRegistry(): Registry {
  return new Registry([...defaultStargateTypes, ...wasmTypes]);
}

function createDeliverTxResponseErrorMessage(
  result: DeliverTxResponse,
): string {
  return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
}

function handleContractError(error: any): ExecuteContractResult {
  try {
    if (isCustomError(error)) {
      throw error;
    }
    if (error.message.search(AppConstants.INSUFFICIENT_FUNDS) > -1)
      throw new CustomError(ErrorMap.INSUFFICIENT_FUNDS);
    if (error instanceof TimeoutError) {
      const txHash = error.message.substring(20, 84);
      return {
        code: undefined,
        transactionHash: txHash,
      } as ExecuteContractResult;
    }
    const txHash = error.message.substring(27, 91);
    const msg1 = error.message.substring(102).split('.');
    const height = msg1[0];
    const msg2 = msg1[1].substring(6).split(';');
    const code = msg2[0];
    const log = error.message;

    return {
      transactionHash: txHash,
      height: Number(height),
      code: Number(code),
      log,
    } as ExecuteContractResult;
  } catch (e) {
    throw error;
  }
}

export class Network extends CosmWasmClient {
  private gasPrice?: any;
  public readonly registry: Registry;
  private readonly _logger = new Logger(Network.name);
  // private wsProvider = new WebsocketProvider(new ConfigService());
  private configService = new ConfigService();

  public static async connectWithSigner(
    rpcEndpoint: string,
    account: Account,
    signer: KMSSigner,
    options: SigningCosmWasmClientOptions = {},
  ) {
    const tmClient = await Tendermint34Client.connect(rpcEndpoint);
    return new Network(tmClient, account, signer, options);
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    public account: Account,
    public signer: KMSSigner,
    options: SigningCosmWasmClientOptions,
  ) {
    super(tmClient);
    this.gasPrice = options.gasPrice;
    this.registry = createDefaultRegistry();
  }

  public async simulate(
    signerAddress: string,
    messages: readonly EncodeObject[],
    memo: string | undefined,
    account: Account,
  ): Promise<number> {
    const anyMsgs = messages.map((m) => this.registry.encodeAsAny(m));
    const accountFromSigner = account;
    const pubkey = encodeSecp256k1Pubkey(accountFromSigner.pubkey);
    const { sequence } = await this.getSequence(signerAddress);
    try {
      const { gasInfo } = await this.forceGetQueryClient().tx.simulate(
        anyMsgs,
        memo,
        pubkey,
        sequence,
      );
      assertDefined(gasInfo);
      return Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: Error) {
    this._logger.error(error);
    if (error.message.search(AppConstants.INSUFFICIENT_FUNDS) > -1)
      throw new CustomError(ErrorMap.INSUFFICIENT_FUNDS);
    if (error.message.search(AppConstants.ALREADY_SOLD) > -1)
      throw new CustomError(ErrorMap.ALREADY_SOLD);
    throw new CustomError(ErrorMap.SIMULATE_TX_FAIL);
  }

  async execute(
    senderAddress: string,
    contractAddress: string,
    msg: any,
    fee: StdFee | 'auto' | number,
    options: InstantiateOptions = {},
  ) {
    try {
      const execResult = await this.executeContract(
        senderAddress,
        contractAddress,
        msg,
        fee,
        options,
      );
      //Emit msg to websocket
      // await this.wsProvider.emitTxHashMessage({txHashArr: [execResult.transactionHash]});

      return {
        code: 0,
        height: execResult.height,
        gasUsed: execResult.gasUsed,
        gasWanted: execResult.gasWanted,
        transactionHash: execResult.transactionHash,
        logs: execResult.logs,
        usedFee: execResult.usedFee,
      } as ExecuteContractResult;
    } catch (error) {
      return handleContractError(error);
    }
  }

  async executeContract(
    senderAddress: string,
    contractAddress: string,
    msg: any,
    fee: StdFee | 'auto' | number,
    options: InstantiateOptions = {},
  ) {
    const executeContractMsg: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
      }),
    };


    const [result, usedFee] = await this.signAndBroadcast(
      senderAddress,
      [executeContractMsg],
      fee,
      options.memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }

    //Emit msg to websocket
    // await this.wsProvider.emitTxHashMessage({txHashArr: [result.transactionHash]});

    return {
      logs: logs.parseRawLog(result.rawLog),
      height: result.height,
      transactionHash: result.transactionHash,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
      usedFee,
    };
  }

  async instantiateSmartcontract(
    senderAddress: string,
    codeId: number,
    msg: Record<string, unknown>,
    label: string,
    fee: StdFee | 'auto' | number,
    options: InstantiateOptions = {},
  ): Promise<InstantiateResult> {
    const instantiateContractMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      value: MsgInstantiateContract.fromPartial({
        sender: senderAddress,
        codeId: fromString(new Uint53(codeId).toString()),
        label: label,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
        admin: options.admin,
      }),
    };
    const [result] = await this.signAndBroadcast(
      senderAddress,
      [instantiateContractMsg],
      fee,
      options.memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    const parsedLogs = logs.parseRawLog(result.rawLog);
    const contractAddressAttr = logs.findAttribute(
      parsedLogs,
      'instantiate',
      '_contract_address',
    );

    //Emit msg to websocket
    // await this.wsProvider.emitTxHashMessage({txHashArr: [result.transactionHash]});

    return {
      contractAddress: contractAddressAttr.value,
      logs: parsedLogs,
      height: result.height,
      transactionHash: result.transactionHash,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  /** Uploads code and returns a receipt, including the code ID */
  public async upload(
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<UploadResult> {
    const compressed = gzip(wasmCode, { level: 9 });
    const storeCodeMsg: MsgStoreCodeEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgStoreCode',
      value: MsgStoreCode.fromPartial({
        sender: senderAddress,
        wasmByteCode: compressed,
      }),
    };

    const [result] = await this.signAndBroadcast(
      senderAddress,
      [storeCodeMsg],
      fee,
      memo,
    );
    if (isDeliverTxFailure(result)) {
      throw new Error(createDeliverTxResponseErrorMessage(result));
    }
    const parsedLogs = logs.parseRawLog(result.rawLog);
    const codeIdAttr = logs.findAttribute(parsedLogs, 'store_code', 'code_id');

    //Emit msg to websocket
    // await this.wsProvider.emitTxHashMessage({txHashArr: [result.transactionHash]});

    return {
      originalSize: wasmCode.length,
      originalChecksum: toHex(sha256(wasmCode)),
      compressedSize: compressed.length,
      compressedChecksum: toHex(sha256(compressed)),
      codeId: Number.parseInt(codeIdAttr.value, 10),
      logs: parsedLogs,
      height: result.height,
      transactionHash: result.transactionHash,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  /**
   * Creates a transaction with the given messages, fee and memo. Then signs and broadcasts the transaction.
   *
   * @param signerAddress The address that will sign transactions using this instance. The signer must be able to sign with this address.
   * @param messages
   * @param fee
   * @param memo
   */
  public async signAndBroadcast(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | 'auto' | number,
    memo = '',
  ): Promise<[DeliverTxResponse, StdFee]> {
    let usedFee: StdFee;
    if (fee == 'auto' || typeof fee === 'number') {
      usedFee = await this.getUsedFee(signerAddress, messages, fee, memo);
    } else {
      usedFee = fee;
    }
    // TODO: check balance
    const txRaw = await this.sign(signerAddress, messages, usedFee, memo);
    const txBytes = TxRaw.encode(txRaw).finish();
    const result = await this.broadcastTx(txBytes, undefined, undefined);
    return [result, usedFee];
  }

  async getUsedFee(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | 'auto' | number,
    memo = '',
  ) {
    assertDefined(
      this.gasPrice,
      'Gas price must be set in the client options when auto gas is used.',
    );
    const gasEstimation = await this.simulate(
      signerAddress,
      messages,
      memo,
      this.account,
    );
    const multiplier = typeof fee === 'number' ? fee : 1.3;
    return calculateFee(Math.round(gasEstimation * multiplier), this.gasPrice);
  }

  async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
  ) {
    const { accountNumber, sequence } = await this.getSequence(signerAddress);
    const chainId = await this.getChainId();
    const signerData: SignerData = {
      accountNumber: accountNumber,
      sequence: sequence,
      chainId: chainId,
    };

    return this.signDirect(messages, fee, memo, signerData);
  }

  async signDirect(
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ) {
    const accountFromSigner = {
      pubkey: this.account.pubkey,
      address: this.account.address,
    };
    const pubkey = encodePubkey(
      encodeSecp256k1Pubkey(accountFromSigner.pubkey),
    );
    const txBody: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
      },
    };

    const registry: Registry = new Registry([
      ...defaultStargateTypes,
      ...wasmTypes,
    ]);
    const txBodyBytes = registry.encode(txBody);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit,
    );
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    );

    const signature = await this.signer.signWithKMS(signDoc);
    const signatureBytes = new Uint8Array([
      ...signature.r(32),
      ...signature.s(32),
    ]);
    const stdSignature = encodeSecp256k1Signature(
      accountFromSigner.pubkey,
      signatureBytes,
    );

    const signed = signDoc;
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(stdSignature.signature)],
    });
  }
}

export class NetworkUtils {
  private readonly _logger = new Logger(NetworkUtils.name);
  private configService = new ConfigService();

  private EcdsaPubKey = asn1.define('EcdsaPubKey', function (this: any) {
    // parsing this according to https://tools.ietf.org/html/rfc5480#section-2
    this.seq().obj(
      this.key('algo').seq().obj(this.key('a').objid(), this.key('b').objid()),
      this.key('pubKey').bitstr(),
    );
  });

  private rawSecp256k1PubkeyToRawAddress(pubkeyData: Uint8Array): Uint8Array {
    if (pubkeyData.length !== 33) {
      throw new Error(
        `Invalid Secp256k1 pubkey length (compressed): ${pubkeyData.length}`,
      );
    }
    return ripemd160(sha256(pubkeyData));
  }

  getAddress(publicKey: Buffer) {
    // The public key is ASN1 encoded in a format according to
    // https://tools.ietf.org/html/rfc5480#section-2
    // I used https://lapo.it/asn1js to figure out how to parse this
    // and defined the schema in the EcdsaPubKey object
    const res = this.EcdsaPubKey.decode(publicKey, 'der');
    const pubKeyBuffer: Buffer = res.pubKey.data;
    this._logger.debug(`pubKeyBuffer.length: ${pubKeyBuffer.length}`);
    const pubkey = Secp256k1.compressPubkey(pubKeyBuffer);
    const systemAddress = toBech32(
      this.configService.get('ADDRESS_PREFIX'),
      this.rawSecp256k1PubkeyToRawAddress(pubkey),
    );

    return { systemAddress, pubkey };
  }

  encodePublicKey(pubKey: Uint8Array) {
    return encodePubkey(encodeSecp256k1Pubkey(pubKey));
  }
}
