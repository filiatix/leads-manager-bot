import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  AfterInsert,
} from 'typeorm';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  countryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @AfterInsert()
  createMessages() {
    console.log('Lead created. Create messages for this lead.');
    //TODO: Create messages for this lead.
  }
}
