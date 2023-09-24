import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeadsService } from './leads.service';
import { LeadCreate } from './dto/create-lead.dto';
import { Lead } from './leads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  providers: [LeadsService, LeadCreate],
  exports: [LeadsService, LeadCreate],
})
export class LeadsModule {}
