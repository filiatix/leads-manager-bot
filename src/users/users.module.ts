import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { LeadsModule } from './../leads/leads.module';
import { User } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LeadsModule],
  providers: [UsersService],
})
export class UsersModule {}
