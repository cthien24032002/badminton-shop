import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { getEnv } from 'src/common/config/env.config';
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT') || '3306', 10),
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
