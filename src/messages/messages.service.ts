import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

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
    // Get 30 messages that have not been sent
    // and whose user has not sent a message in last second
    const lastMessageSentAt = new Date();
    lastMessageSentAt.setSeconds(lastMessageSentAt.getSeconds() - 1);
    return await this.repo.find({
      relations: { lead: true, user: true },
      where: {
        isSent: false,
        // user: [
        //   { lastMessageSentAt: LessThan(lastMessageSentAt) },
        //   { lastMessageSentAt: null },
        // ],
      },
      take: 30,
    });
  }
}
