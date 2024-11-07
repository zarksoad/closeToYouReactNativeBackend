import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async checkContact(email: string): Promise<string> {
    const user = await this.contactRepository.findOne({ where: { email } });
    if (user) {
      throw new NotFoundException('The email has already been used');
    }
    return email;
  }

  async createContact(createUserDTO: CreateContactDto): Promise<Contact> {
    await this.checkContact(createUserDTO.email);
    const contact = await this.contactRepository.create(createUserDTO);
    const newContact = await this.contactRepository.save(contact);
    return newContact;
  }

  async verifyContact(contactId: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
    });
    if (!contact) {
      throw new NotFoundException('tournament not found');
    }
    return contact;
  }

  async updateContact(
    contactId: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contactUpdate = await this.verifyContact(contactId);
    Object.assign(contactUpdate, updateContactDto);
    return await this.contactRepository.save(contactUpdate);
  }
}
