import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Lead } from './leads/leads.entity';
import { User } from './users/users.entity';
import { Message } from './messages/messages.entity';
import { Migrations1696489702777 } from './migrations/1696489702777-migrations';

export const appDataSource = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    entities: [Lead, User, Message],
    migrations: [Migrations1696489702777],
    synchronize: false,
    logging: 'all',
    extra: {},
  };
};
