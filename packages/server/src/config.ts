import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface DatabaseConfig {
  default: string;
  mysql?: { host: string; port: number; username: string; password: string; database: string; };
  postgres?: { host: string; port: number; username: string; password: string; database: string; };
  sqlite?: { filepath: string; };
}

interface AuthConfig {
  jwtSecret: string;
  sessionSecret: string;
  oauth?: {
    google?: { clientId: string; clientSecret: string; };
    github?: { clientId: string; clientSecret: string; };
  };
}

interface ServerConfig {
  port: number;
}

interface RedisConfig {
  url: string;
}

interface DeploymentConfig {
  target: string;
}

interface AppConfig {
  appName: string;
  env: string;
  server: ServerConfig;
  database: DatabaseConfig;
  redis?: RedisConfig;
  auth: AuthConfig;
  deployment: DeploymentConfig;
}

// Read and parse config.yaml
const configPath = path.resolve(__dirname, '../../../config.yaml');
const configFile = fs.readFileSync(configPath, 'utf8');
const rawConfig = yaml.load(configFile) as AppConfig;

// Validate required fields
const requiredFields = [
  'appName',
  'env',
  'server.port',
  'database.default',
  'auth.jwtSecret',
  'auth.sessionSecret',
  'deployment.target'
];

for (const field of requiredFields) {
  const value = field.split('.').reduce((obj, key) => obj?.[key], rawConfig);
  if (value === undefined) {
    throw new Error(`Missing required config field: ${field}`);
  }
}

// Export validated config
export const config: AppConfig = rawConfig; 