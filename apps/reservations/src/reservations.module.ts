import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { Reservation } from './models/reservation.entity';
import { LoggerModule } from '@app/common/logger/logger.module';
import * as Joi from 'joi';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '@app/common/constants/services.enum';
import { HealthModule } from '@app/common/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: ServicesEnum.AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get<number>('AUTH_PORT'),
          },
        }),
      },
      {
        name: ServicesEnum.PAYMENTS_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get<number>('PAYMENTS_PORT'),
          },
        }),
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
