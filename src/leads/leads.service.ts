import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lead } from './leads.entity';
import { LeadCreate } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
  ) {}

  createLead(newLead: LeadCreate): Promise<Lead> {
    console.log(`Create lead: ${JSON.stringify(newLead)}`);
    const lead = this.repo.create(newLead);
    return this.repo.save(lead);
  }
}
