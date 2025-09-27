import * as fs from 'fs';
import { Logger } from 'winston';

/**
 * Hàm wrapper để xử lý rollback file nếu có lỗi
 * @param file file upload (Express.Multer.File)
 * @param handler hàm async thực thi logic chính
 */
export async function withFileRollback<T>(
  file: Express.Multer.File | undefined,
  handler: () => Promise<T>,
  logger?: Logger,
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    if (file) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        logger?.error({
          message: 'Không thể xóa file khi rollback',
          file: file.path,
          e,
        });
      }
    }
    throw error;
  }
}
