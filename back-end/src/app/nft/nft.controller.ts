import { Constant, logger, onError, onSuccess, OptionResponse } from '@constants';
import { Singleton } from '@providers';
import { INFT } from '@schemas';
import { Controller, Get, Route, Tags } from 'tsoa';

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
@Tags('nft')
@Route('nft')
export class NFTController extends Controller {
  @Get('list')
  public async getList(): Promise<OptionResponse<INFT>> {
    try {
      return onSuccess(await Singleton.getNFTInstance().getList());
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
