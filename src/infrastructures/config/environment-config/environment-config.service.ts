import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/domains/config/database.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig {
  constructor(private configService: ConfigService) { }

  getDatabaseHost(): string {
    return this.configService.get<string>('POSTGRES_HOST')!;
  }

  getDatabasePort(): number {
    return this.configService.get<number>('POSTGRES_PORT')!;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('POSTGRES_USER')!;
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD')!;
  }

  getDatabaseName(): string {
    return this.configService.get<string>('POSTGRES_DATABASE')!;
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA')!;
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE')!;
  }
}
