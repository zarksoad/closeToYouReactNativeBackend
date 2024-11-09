import { Injectable, NotFoundException, Delete } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createContact(
    userId: string,
    createUserDTO: CreateContactDto,
  ): Promise<Contact> {
    await this.checkContact(createUserDTO.email);
    const contact = await this.contactRepository.create({
      ...createUserDTO,
      userId,
    });
    const newContact = await this.contactRepository.save(contact);
    return newContact;
  }

  async verifyContact(contactId: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
    });
    if (!contact) {
      throw new NotFoundException('contact not found');
    }
    return contact;
  }

  async updateContact(
    contactId: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contactUpdate = await this.verifyContact(contactId);
    console.log('**************************');
    console.log('this is the contact', contactUpdate);
    console.log('**************************');
    Object.assign(contactUpdate, updateContactDto);
    return await this.contactRepository.save(contactUpdate);
  }

  async deleteContact(contactId: string): Promise<Contact> {
    const contact = await this.verifyContact(contactId);
    return await this.contactRepository.remove(contact);
  }

  async findAllContacts(userId: string): Promise<Contact[]> {
    return await this.contactRepository.find({ where: { userId: userId } });
  }
}
