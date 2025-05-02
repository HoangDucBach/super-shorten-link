import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, DatabaseStreamType } from 'src/domains/config/database.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig {
  constructor(private configService: ConfigService) { }
  getDatabaseHost(type: DatabaseStreamType): string {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<string>('READ_POSTGRES_HOST')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<string>('WRITE_POSTGRES_HOST')!;
      default:
        throw new Error('Invalid database stream type');

    }
  }

  getDatabasePort(type: DatabaseStreamType): number {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<number>('READ_POSTGRES_PORT')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<number>('WRITE_POSTGRES_PORT')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
  getDatabaseUser(type: DatabaseStreamType): string {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<string>('READ_POSTGRES_USER')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<string>('WRITE_POSTGRES_USER')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
  getDatabasePassword(type: DatabaseStreamType): string {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<string>('READ_POSTGRES_PASSWORD')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<string>('WRITE_POSTGRES_PASSWORD')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
  getDatabaseName(type: DatabaseStreamType): string {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<string>('READ_POSTGRES_DATABASE')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<string>('WRITE_POSTGRES_DATABASE')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
  getDatabaseSchema(type: DatabaseStreamType): string {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<string>('READ_DATABASE_SCHEMA')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<string>('WRITE_DATABASE_SCHEMA')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
  getDatabaseSync(type: DatabaseStreamType): boolean {
    switch (type) {
      case DatabaseStreamType.READ:
        return this.configService.get<boolean>('READ_DATABASE_SYNCHRONIZE')!;
      case DatabaseStreamType.WRITE:
        return this.configService.get<boolean>('WRITE_DATABASE_SYNCHRONIZE')!;
      default:
        throw new Error('Invalid database stream type');
    }
  }
}
