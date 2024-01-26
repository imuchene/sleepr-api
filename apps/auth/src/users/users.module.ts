import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { User } from '@app/common/models/user.entity';
import { Role } from '@app/common/models/role.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      User, Role
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
