import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UserId } from 'src/common/decorators/user.id.decorator';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  createContact(
    @UserId() userId: string,
    @Body() createContactDto: CreateContactDto,
  ) {
    console.log(createContactDto, userId, 'new contact');
    return this.contactsService.createContact(userId, createContactDto);
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
  @Get()
  findAll() {
    return this.contactsService.findAllContacts();
  }

  @Get(':id')
  findContact(@Param('id') contactId: string) {
    const contact = this.contactsService.verifyContact(contactId);
    return contact;
  }
}
