import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.createContact(createContactDto);
  }

  @Patch(':id')
  update(
    @Param('id') contactId: string,
    @Body() updateTournamentDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(contactId, updateTournamentDto);
  }
  @Delete(':id')
  remove(@Param('id') contactId: string) {
    return this.contactsService.deleteContact(contactId);
  }
}
