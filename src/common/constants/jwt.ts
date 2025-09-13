import { getEnv } from '../config/env.config';


export const jwtConstants = {
  secret: getEnv('JWT_SECRET') as string,
};
