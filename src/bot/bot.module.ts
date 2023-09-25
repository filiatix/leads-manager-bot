import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { BotUpdate } from './bot.update';
import { LeadWizard } from './wizard/lead.wizard';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    LeadsModule,
  ],
  providers: [BotUpdate, LeadWizard],
})
export class BotModule {}
