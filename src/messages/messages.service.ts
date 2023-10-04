import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  createMessage(): Message {
    return this.repo.create();
  }

  async saveMessage(message: Message): Promise<Message> {
    return await this.repo.save(message);
  }

  async getMessagesToSend(): Promise<Message[]> {
    return await this.repo.find({ where: { isSent: false } });
  }
}
