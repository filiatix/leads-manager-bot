import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Message } from '../messages/messages.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastMessageSentAt: Date;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
