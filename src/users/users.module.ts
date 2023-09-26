import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users.entity';
import { UsersService } from './users.service';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LeadsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
