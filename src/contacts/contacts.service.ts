import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly dataSource: DataSource,
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
    const contact = this.contactRepository.create({
      ...createUserDTO,
      userId,
    });
    const newContact = await this.contactRepository.save(contact);
    return newContact;
  }

  async createBatchContacts(
    userId: string,
    createContactsDTO: CreateContactDto[],
  ): Promise<Contact[]> {
    const contacts: Contact[] = [];
    for (let i = 0; i < createContactsDTO.length; i++) {
      contacts.push(
        this.contactRepository.create({
          ...createContactsDTO[i],
          userId,
        }),
      );
    }
    return await this.dataSource.manager.save(contacts);
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

  async findAllContacts(
    userId: string,
    filterByName: string | null,
  ): Promise<Contact[]> {
    const whereCondition: FindOptionsWhere<Contact> = { userId };

    if (filterByName) {
      whereCondition.name = Like(`%${filterByName}%`);
    }

    return await this.contactRepository.find({ where: whereCondition });
  }
}
