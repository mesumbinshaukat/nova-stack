import mysql from 'mysql2/promise';
import { DbAdapter } from './adapter';

export class MySQLAdapter implements DbAdapter {
  private pool: mysql.Pool;

  constructor(private cfg: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }) {}

  async connect(): Promise<void> {
    this.pool = mysql.createPool({
      host: this.cfg.host,
      port: this.cfg.port,
      user: this.cfg.username,
      password: this.cfg.password,
      database: this.cfg.database
    });
  }

  async query(query: string, params: any[] = []): Promise<any> {
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
} 