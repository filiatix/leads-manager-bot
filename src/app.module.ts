import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { getAppDataSourceOptions } from './data-source';
import { BotModule } from './bot/bot.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        await getAppDataSourceOptions(configService),
    }),
    ScheduleModule.forRoot(),
    BotModule,
    UsersModule,
    LeadsModule,
    MessagesModule,
  ],
})
export class AppModule {}
