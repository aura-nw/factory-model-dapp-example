import { ResponseDto } from "../dtos/responses";
import { MODULE_REQUEST } from "../module.config";


export interface IKMSService {
  /**
   * connect
   * @param param
   */
  connectKMS(param: MODULE_REQUEST.ConnectKMSParam): Promise<ResponseDto>;

  /**
   * sign
   * @param param
   */
  signWithKMS(
    param: MODULE_REQUEST.SignKMSParam,
    body: MODULE_REQUEST.SignKMSRequest,
  ): Promise<ResponseDto>;

}
