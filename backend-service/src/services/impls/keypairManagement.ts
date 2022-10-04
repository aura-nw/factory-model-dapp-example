import { Logger } from '@nestjs/common';
import { KMS } from 'aws-sdk';
import { toBase64 } from 'cosmwasm';
import { AppConstants } from '../../common/constants/app.constant';
import { ConfigService } from '../../shared/services/config.service';
import { bigNumberToBuffer, decodeAWSSignature } from '../../utils/decode.utils';

export class KeyPairManagement {
  private readonly _logger = new Logger(KeyPairManagement.name);
  configService = new ConfigService();
  kms: KMS;
  constructor() {
    const accessKeyId = this.configService.get('KMS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('KMS_SECRET_ACCESS_KEY');
    const region = this.configService.get('KMS_REGION');
    const apiVersion = this.configService.get('KMS_API_VERSION');
    this.kms = new KMS({
      accessKeyId,
      secretAccessKey,
      region,
      apiVersion,
    });
  }

  async getPubKeyByAliasName(aliasName: string) {
    try {
      const alias = this.stringToAlias(aliasName);
      const result = await this.kms
        .getPublicKey({
          KeyId: alias,
        })
        .promise();
      const pubKey = result.PublicKey as Buffer;
      return pubKey;
    } catch (error) {
      this._logger.debug(error);
      if (error.code && error.code === 'NotFoundException') return null;
      throw error;
    }
  }

  async createKMSKey(aliasName: string) {
    const param: KMS.CreateKeyRequest = {
      Description: 'artaverse-kms-api',
      KeySpec: 'ECC_SECG_P256K1',
      KeyUsage: 'SIGN_VERIFY',
      MultiRegion: false,
    };
    const result = await this.kms.createKey(param).promise();
    const keyId = result.KeyMetadata.KeyId;
    const alias = this.stringToAlias(aliasName);
    const res = await this.createAlias(alias, keyId);
    if (res)
      this._logger.debug(
        `Create alias ${alias} for KMS key ${keyId} successful! `,
      );
    return {
      keyId,
      alias,
    };
  }

  async sign(
    // msgHash: string,
    msgHash: Uint8Array,
    aliasName: string,
  ): Promise<{
    r: string;
    s: string;
  }> {
    const alias = this.stringToAlias(aliasName);
    const params: KMS.SignRequest = {
      // key id or 'Alias/<alias>'
      KeyId: alias,
      Message: msgHash,
      // 'ECDSA_SHA_256' is the one compatible with ECC_SECG_P256K1.
      SigningAlgorithm: 'ECDSA_SHA_256',
      MessageType: 'DIGEST',
    };
    const res = await this.kms.sign(params).promise();
    const signature = res.Signature;
    const { R, S } = await decodeAWSSignature(signature);
    const rBuff = bigNumberToBuffer(R, AppConstants.LENGTH_IN_BYTES);
    const sBuff = bigNumberToBuffer(S, AppConstants.LENGTH_IN_BYTES);
    return {
      r: toBase64(rBuff),
      s: toBase64(sBuff),
    };
    // const secp256k1sig = new Secp256k1Signature(rBuff, sBuff);
    // return secp256k1sig;
  }

  async createAlias(alias: string, keyId: string) {
    const params: KMS.CreateAliasRequest = {
      AliasName: alias,
      TargetKeyId: keyId,
    };
    return this.kms.createAlias(params).promise();
  }

  stringToAlias(aliasName: string) {
    return `alias/${aliasName}`;
  }
}
