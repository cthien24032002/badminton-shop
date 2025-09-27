import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const dailyRotateFile = (level: string) =>
  new winston.transports.DailyRotateFile({
    dirname: 'logs',                        // Thư mục lưu log
    filename: `%DATE%-${level}.log`,        // Tên file log
    datePattern: 'YYYY-MM-DD',              // Format ngày
    zippedArchive: true,                    // Nén file cũ
    maxSize: '20m',                         // Giới hạn dung lượng file
    maxFiles: '30d',                        // Giữ log 30 ngày
    level: level,                           // Chỉ log đúng level
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.json(),
    ),
  });

export const winstonConfig = {
  transports: [
    // 🔹 Log error riêng
    dailyRotateFile('error'),

    // // 🔹 Log info riêng
    // dailyRotateFile('info'),

    // 🔹 Log ra console (dev)
    new winston.transports.Console({
      format: winston.format.combine(
        // winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // nestWinstonModuleUtilities.format.nestLike(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(), 
      ),
    }),
  ],
};
