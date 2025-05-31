import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { config } from '../config';

const dataSource = new DataSource({
  type: config.database.default as any,
  host: config.database[config.database.default].host,
  port: config.database[config.database.default].port,
  username: config.database[config.database.default].username,
  password: config.database[config.database.default].password,
  database: config.database[config.database.default].database,
  entities: [User],
  synchronize: true,
});

export const db = {
  connect: async () => dataSource.initialize(),
  getRepository: <T>(entity: new () => T) => dataSource.getRepository(entity),
}; 