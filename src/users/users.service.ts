import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  createUser(): User {
    return this.repo.create();
  }

  async saveUser(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.repo.find();
  }
}
