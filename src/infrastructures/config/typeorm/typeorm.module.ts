import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { DatabaseStreamType } from 'src/domains/config/database.interface';

export const getWriteTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions =>
({
  type: 'postgres',
  host: config.getDatabaseHost(DatabaseStreamType.WRITE),
  port: config.getDatabasePort(DatabaseStreamType.WRITE),
  username: config.getDatabaseUser(DatabaseStreamType.WRITE),
  password: config.getDatabasePassword(DatabaseStreamType.WRITE),
  database: config.getDatabaseName(DatabaseStreamType.WRITE),
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrations: [__dirname + '/migrations**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
} as TypeOrmModuleOptions);
export const getReadTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions =>
({
  type: 'postgres',
  host: config.getDatabaseHost(DatabaseStreamType.READ),
  port: config.getDatabasePort(DatabaseStreamType.READ),
  username: config.getDatabaseUser(DatabaseStreamType.READ),
  password: config.getDatabasePassword(DatabaseStreamType.READ),
  database: config.getDatabaseName(DatabaseStreamType.READ),
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
} as TypeOrmModuleOptions);

@Module({
  imports: [
    // WRITE DB
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (config: EnvironmentConfigService) => ({
        ...getWriteTypeOrmModuleOptions(config),
        name: 'write_connection',
      }),
    }),

    // READ DB
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (config: EnvironmentConfigService) => ({
        ...getReadTypeOrmModuleOptions(config),
        name: 'read_connection',
      }),
    }),
  ],
})
export class TypeOrmConfigModule { }
