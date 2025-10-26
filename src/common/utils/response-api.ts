import { HttpStatus } from '@nestjs/common';
import { ApiCustomResponse } from '../response/ApiRespone';

export const handlerApi = (
  data: any,
  httpStatus: HttpStatus,
  message = 'Thành công',
) => {
  return ApiCustomResponse.success(httpStatus, data, message);
};

export const handlerApiFind = (
  data: { dataResult: any; pagination: any },
  httpStatus: HttpStatus,
  message = 'Thành công',
) => {
  return ApiCustomResponse.paginated(
    httpStatus,
    data.dataResult,
    data.pagination,
    message,
  );
};
