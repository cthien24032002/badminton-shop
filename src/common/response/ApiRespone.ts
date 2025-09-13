import { PaginationMeta } from '../utils/pagination.util';

export class ApiCustomResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: any;
  pagination?: PaginationMeta;

  constructor(params: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    errors?: any;
  }) {
    this.success = params.success;
    this.statusCode = params.statusCode;
    this.message = params.message;
    this.data = params.data;
    this.errors = params.errors;
  }

  /**
   * Trả dữ liệu thành công cho response dạng object hoặc đơn item.
   */
  static success<T>(
    statusCode: number,
    data: T,
    message = 'Thành công',
  ): ApiCustomResponse<T> {
    return new ApiCustomResponse<T>({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * Trả dữ liệu thành công cho response dạng danh sách có phân trang.
   */
  static paginated<T>(
    statusCode: number,
    list: T[],
    pagination: PaginationMeta,
    message = 'Lấy danh sách thành công',
  ): ApiCustomResponse<{ list: T[]; pagination: PaginationMeta }> {
    return new ApiCustomResponse({
      success: true,
      statusCode,
      message,
      data: { pagination, list },
    });
  }

  /**
   * Trả response thất bại với message và errors.
   */
  static error(
    statusCode: number,
    message: string = 'Đã xảy ra lỗi',
    errors?: any,
  ): ApiCustomResponse<null> {
    return new ApiCustomResponse<null>({
      success: false,
      statusCode,
      message,
      errors,
    });
  }
}
