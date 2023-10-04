import { DataSourceOptions } from 'typeorm';

import { Lead } from './leads/leads.entity';
import { User } from './users/users.entity';
import { Message } from './messages/messages.entity';
import { Migrations1695734738408 } from './migrations/1695734738408-migrations';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, User, Message],
  migrations: [Migrations1695734738408],
  synchronize: false,
  logging: 'all',
  extra: {},
};
