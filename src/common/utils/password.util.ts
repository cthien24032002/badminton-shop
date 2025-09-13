import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Mã hóa mật khẩu bằng bcrypt
 * @param plainPassword Mật khẩu dạng text
 * @returns Mật khẩu đã hash
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * So sánh mật khẩu text và mật khẩu đã hash
 * @param plainPassword Mật khẩu dạng text
 * @param hashedPassword Mật khẩu đã hash từ DB
 * @returns true nếu khớp, false nếu sai
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
