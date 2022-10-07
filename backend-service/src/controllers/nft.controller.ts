import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// import { ROLE_ENUM } from 'artaverse-submodule/common/constants/app-constants';
import { CONTROLLER_CONSTANTS, URL_CONSTANTS } from '../common/constants/api.constant';
// import { GroupsGuard } from '../guards/groups.guard';
import { MODULE_REQUEST, SERVICE_INTERFACE } from '../module.config';
import { INFTService } from '../services/inft.service';


@Controller(CONTROLLER_CONSTANTS.NFT)
@ApiTags(CONTROLLER_CONSTANTS.NFT)
export class NftController {
  public readonly _logger = new Logger(NftController.name);
  constructor(
    @Inject(SERVICE_INTERFACE.INFT_SERVICE)
    private nftService: INFTService,
  ) {}

  @Post(URL_CONSTANTS.INSTANTIATE_CONTRACT)
  @ApiOperation({
    summary: 'Instantiate cw721 contract',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  // @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @ApiBearerAuth()
  // @UseInterceptors(AuthUserInterceptor)
  // @Roles(ROLE_ENUM.USER)
  @HttpCode(HttpStatus.OK)
  async instantiateContract(@Body() request: MODULE_REQUEST.InstantiateContractRequest) {
    this._logger.log('========== Instantiate Contract ==========');
    return this.nftService.instantiateContract(request);
  }

  @Post(URL_CONSTANTS.MINT_NFT)
  @ApiOperation({
    summary: 'mint nft',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  // @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @ApiBearerAuth()
  // @UseInterceptors(AuthUserInterceptor)
  @HttpCode(HttpStatus.OK)
  // @Roles(ROLE_ENUM.USER)
  async mintNFT(@Body() request: MODULE_REQUEST.MintNftRequest) {
    this._logger.log('========== Mint NFT ==========');
    return this.nftService.mint(request);
  }

  @Post(URL_CONSTANTS.TRANSFER_NFT)
  @ApiOperation({
    summary: 'transfer nft',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  // @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @ApiBearerAuth()
  // @UseInterceptors(AuthUserInterceptor)
  @HttpCode(HttpStatus.OK)
  // @Roles(ROLE_ENUM.USER)
  async transferNFT(@Body() request: MODULE_REQUEST.TransferNftRequest) {
    this._logger.log('========== Transfer NFT ==========');
    return this.nftService.transfer(request);
  }

  @Post(URL_CONSTANTS.INSTANTIATE_CONTRACT_BY_MNEMONIC)
  @ApiOperation({
    summary: 'Instantiate cw721 contract sign by mnemonic',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  // @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @ApiBearerAuth()
  // @UseInterceptors(AuthUserInterceptor)
  // @Roles(ROLE_ENUM.USER)
  @HttpCode(HttpStatus.OK)
  async instantiateContractByMnemonic(@Body() request: MODULE_REQUEST.InstantiateContractByMnemonicRequest) {
    this._logger.log('========== Instantiate Contract ==========');
    return this.nftService.instantiateContractByMnemonic(request);
  }

  @Post(URL_CONSTANTS.MINT_BFT_BY_MNEMONIC)
  @ApiOperation({
    summary: 'Mint NFT by mnemonic',
  })
  @ApiBadRequestResponse({ description: 'Error: Bad Request', schema: {} })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async mintNftByMnemonic(@Body() request: MODULE_REQUEST.MintNftByMnemonicRequest) {
    this._logger.log('========== Mint nft by mnemonic ==========');
    return this.nftService.mintByMnemonic(request);
  }
}
