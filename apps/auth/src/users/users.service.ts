import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { User } from '@app/common/models/user.entity';
import { Role } from '@app/common/models/role.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);

    try {
      const salt = await bcrypt.genSalt();

      const user = new User({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, salt),
        roles: createUserDto.roles?.map((roleDto) => new Role(roleDto))
      });

      return this.usersRepository.create(user);
    } catch (error) {
      Logger.error('[usersService] error', error);
    }
  }

  async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
