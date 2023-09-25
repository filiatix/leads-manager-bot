import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { BotUpdate } from './bot.update';
import { LeadWizard } from './wizard/lead.wizard';
import { LeadsModule } from '../leads/leads.module';
import { LeadsBotName } from '../app.constants';
import { sessionMiddleware } from '../middleware/session.middleware';

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
  ],
  providers: [BotUpdate, LeadWizard],
})
export class BotModule {}
