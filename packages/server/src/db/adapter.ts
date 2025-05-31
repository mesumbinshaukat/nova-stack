export interface DbAdapter {
  connect(): Promise<void>;
  query(query: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
} 