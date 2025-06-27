import { config as devConfig } from './env.dev';
import { config as prodConfig } from './env.prod';

const environment = process.env.NODE_ENV || 'development';

let config: Record<string, any>;

const isProductionScript = process.argv.some(
  (arg) => arg.includes('build:prod') || arg.includes('start:prod')
);

if (environment === 'production' || isProductionScript) {
  console.log('Running in PRODUCTION environment');
  config = prodConfig;
} else {
  console.log('Running in DEVELOPMENT environment');
  config = devConfig;
}

export default config;
