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

  async createLead(newLead: LeadCreate): Promise<Lead> {
    console.log(`Create lead: ${JSON.stringify(newLead)}`);
    const lead = await this.repo.create(newLead);
    try {
      const savedLead = await this.repo.save(lead);
      console.log(`Saved lead: ${JSON.stringify(savedLead)}`);
      return savedLead;
    } catch (error) {
      console.log(`Error saving lead: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
