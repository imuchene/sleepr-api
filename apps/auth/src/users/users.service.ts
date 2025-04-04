import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    try {
      const salt = await bcrypt.genSalt();

      return this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, salt),
        },
      });
    } catch (error) {
      Logger.error('[usersService] error', error);
    }
  }

  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: getUserDto.id },
    });
  }
}
