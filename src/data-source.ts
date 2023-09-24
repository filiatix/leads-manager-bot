import { DataSourceOptions, DataSource } from 'typeorm';

import { Lead } from './leads/leads.entity';
import { User } from './users/users.entity';
import { Message } from './messages/messages.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, User, Message],
  migrations: [],
  synchronize: false,
  extra: {},
};

export const appDataSource = new DataSource(dataSourceOptions);
