import {
  Controller,
  Inject,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Param,
  Request,
  Body,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../common/constants/api.constant';
import { MODULE_REQUEST, SERVICE_INTERFACE } from '../module.config';
import { IKMSService } from '../services/ikms.service';
@Controller(CONTROLLER_CONSTANTS.KMS)
@ApiTags(CONTROLLER_CONSTANTS.KMS)
export class KMSController {
  public readonly _logger = new Logger(KMSController.name);
  constructor(
    @Inject(SERVICE_INTERFACE.IKMS_SERVICE)
    private kmsServices: IKMSService,
  ) {}

  @Post(':creatorAddress/connect')
  @ApiOperation({
    summary: 'Connect KMS',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  @HttpCode(HttpStatus.OK)
  async connectKMS(@Param() param: MODULE_REQUEST.ConnectKMSParam) {
    this._logger.log('========== Connect KMS ==========');
    return this.kmsServices.connectKMS(param);
  }

  @Post(':creatorAddress/sign')
  @ApiOperation({
    summary: 'Digital signing with AWS KMS',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  @HttpCode(HttpStatus.OK)
  async signWithKMS(
    @Param() param: MODULE_REQUEST.SignKMSParam,
    @Body() body: MODULE_REQUEST.SignKMSRequest,
  ) {
    this._logger.log('========== Digital signing with AWS KMS ==========');
    return this.kmsServices.signWithKMS(param, body);
  }

}
