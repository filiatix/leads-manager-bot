import { DataSourceOptions, DataSource } from 'typeorm';

import { Lead } from './leads/leads.entity';
import { User } from './users/users.entity';
import { Message } from './messages/messages.entity';
import { Migrations1695734738408 } from './migrations/1695734738408-migrations';
import { Migrations1696421730788 } from './migrations/1696421730788-migrations';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, User, Message],
  migrations: [Migrations1695734738408, Migrations1696421730788],
  synchronize: false,
  logging: 'all',
  extra: {},
};

export const appDataSource = new DataSource(dataSourceOptions);
