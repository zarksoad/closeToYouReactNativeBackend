import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  async checkEmail(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new NotFoundException('The email has already been used');
    }
    return email;
  }

  async checkUser(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("User hasn't been registered");
    }
    return user;
  }
  async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<Boolean> {
    const validation = await bcrypt.compare(password, hashPassword);
    if (!validation) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    return validation;
  }

  async token(
    userId: string,
  ): Promise<{ message: string; accessToken: string }> {
    const payload = { userId: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      message: 'This is the token',
      accessToken: accessToken,
    };
  }

  async LogIn(
    loginDto: loginAuthDto,
  ): Promise<{ message: string; accessToken: string }> {
    const user = await this.checkUser(loginDto.email);
    await this.checkPassword(loginDto.password, user.password);
    const { accessToken } = await this.token(user.id);
    return { message: 'this is your token', accessToken };
  }

  async createUser(createUserDTO: CreateUserDto): Promise<User> {
    await this.checkEmail(createUserDTO.email);
    createUserDTO.password = await this.hashPassword(createUserDTO.password);
    const user = await this.userRepository.create(createUserDTO);
    const newUser = await this.userRepository.save(user);
    return newUser;
  }
}
