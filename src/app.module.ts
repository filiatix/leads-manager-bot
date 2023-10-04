import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './data-source';
import { BotModule } from './bot/bot.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    BotModule,
    UsersModule,
    LeadsModule,
    MessagesModule,
  ],
})
export class AppModule {}
