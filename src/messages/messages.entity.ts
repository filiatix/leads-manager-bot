import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './../users/users.entity';
import { Lead } from './../leads/leads.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @OneToOne(() => Lead)
  @JoinColumn()
  lead: Lead;

  @Column()
  isSent: boolean;
}
