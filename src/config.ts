import { config as dotenvConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenvConfig();
}

const config = {
  appUrl: process.env.APP_URL,
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
};

export default config;
