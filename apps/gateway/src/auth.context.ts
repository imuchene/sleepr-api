import { ServicesEnum } from '@app/common/constants/services.enum';
import { app } from './app';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

export const authContext = async ({ req }) => {
  try {
    const authClient = app.get<ClientProxy>(ServicesEnum.AUTH_SERVICE);
    const user = await lastValueFrom(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );

    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
