export enum DatabaseStreamType {
  READ,
  WRITE,
}

export interface DatabaseConfig {
  getDatabaseHost(type: DatabaseStreamType): string;
  getDatabasePort(type: DatabaseStreamType): number;
  getDatabaseUser(type: DatabaseStreamType): string;
  getDatabasePassword(type: DatabaseStreamType): string;
  getDatabaseName(type: DatabaseStreamType): string;
  getDatabaseSchema(type: DatabaseStreamType): string;
  getDatabaseSync(type: DatabaseStreamType): boolean;
}
