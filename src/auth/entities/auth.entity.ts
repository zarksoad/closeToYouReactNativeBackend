import { Contact } from 'src/contacts/entities/contact.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];
}
