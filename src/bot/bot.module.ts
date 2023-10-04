import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { sessionMiddleware } from '../middleware/session.middleware';
import { LeadsBotName } from '../app.constants';
import { BotUpdate } from './bot.update';
import { UsersModule } from '../users/users.module';
import { LeadsModule } from '../leads/leads.module';
import { LeadWizard } from './wizard/lead.wizard';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: LeadsBotName,
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [sessionMiddleware],
      }),
    }),
    LeadsModule,
    UsersModule,
    MessagesModule,
  ],
  providers: [BotUpdate, LeadWizard],
})
export class BotModule {}
