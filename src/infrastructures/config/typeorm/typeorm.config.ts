import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const writeConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrations: ['database/migrations/**/*{.ts,.js}'],
});

const readConfig = new DataSource({
  type: 'postgres',
  host: process.env.READ_POSTGRES_HOST,
  port: 5432,
  username: process.env.READ_POSTGRES_USER,
  password: process.env.READ_POSTGRES_PASSWORD,
  database: process.env.READ_POSTGRES_DATABASE,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.READ_DATABASE_SCHEMA,
  migrationsRun: true,
  migrations: ['database/migrations/**/*{.ts,.js}'],
});


Promise.all([
  writeConfig.initialize(),
  readConfig.initialize()
])
  .then(() => {
  })
  .catch((err) => {
    console.error('Error during Data Sources initialization', err);
  });

export { writeConfig, readConfig };