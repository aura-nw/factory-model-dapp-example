import { Injectable, Logger } from '@nestjs/common';
import { ErrorMap } from '../../common/error.map';
import { IKMSService } from '../ikms.service';
import { KeyPairManagement } from './keypairManagement';
import { fromBase64, toBase64 } from 'cosmwasm';
import { NetworkUtils } from '../../utils/network.utils';
import { ConfigService } from '../../shared/services/config.service';
import { MODULE_REQUEST } from '../../module.config';
import { ResponseDto } from '../../dtos/responses';

@Injectable()
export class KMSService implements IKMSService {
  private readonly _logger = new Logger(KMSService.name);
  private _configService = new ConfigService();
  keypairSvc = new KeyPairManagement();
  network = new NetworkUtils;

  constructor() {
    this._logger.log('============== Constructor KMS ==============');
  }

  async connectKMS(
    param: MODULE_REQUEST.ConnectKMSParam,
  ): Promise<ResponseDto> {
    try {
      // 1. get pubkey by alias
      const { creatorAddress } = param;
      const pubKey = await this.keypairSvc.getPubKeyByAliasName(creatorAddress);
      // 2. if not found > create key and alias
      if (!pubKey) {
        const { alias } = await this.keypairSvc.createKMSKey(creatorAddress);

        if (alias) return this.connectKMS(param);
      }
      // 3. generate address by pubKey
      const { systemAddress, pubkey } = this.network.getAddress(pubKey);
      // 4. return address
      const encodePubkey = toBase64(pubkey);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {
        systemAddress,
        encodePubkey,
      });
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(KMSService.name, error);
    }
  }

  async signWithKMS(
    param: MODULE_REQUEST.SignKMSParam,
    body: MODULE_REQUEST.SignKMSRequest,
  ): Promise<ResponseDto> {
    try {
      const { creatorAddress } = param;
      const { encodeMsg } = body;

      const msgHash = fromBase64(encodeMsg);
      const rsBase64 = await this.keypairSvc.sign(msgHash, creatorAddress);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, rsBase64);
    } catch (error) {
      this._logger.error(error);
      return ResponseDto.responseError(KMSService.name, error);
    }
  }

}
