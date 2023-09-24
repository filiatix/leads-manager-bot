import { Module } from '@nestjs/common';

import { BotUpdate } from './bot.update';
import { LeadWizard } from './wizard/lead.wizard';
import { LeadsService } from '../leads/leads.service';
import { LeadsModule } from '../leads/leads.module';
import { LeadCreate } from 'src/leads/dto/create-lead.dto';

@Module({
  imports: [LeadsModule],
  providers: [BotUpdate, LeadWizard, LeadsService, LeadCreate],
})
export class BotModule {}
