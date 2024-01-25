import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { ServicesEnum } from '@app/common/constants/services.enum';
import { UserDto } from '@app/common/dto/user.dto';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(ServicesEnum.PAYMENTS_SERVICE)
    private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ): Promise<any> {
    return this.paymentsService
      .send('create_charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res: any) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });

          return this.reservationsRepository.create(reservation);
        }),
      );
  }

  async findAll() {
    return await this.reservationsRepository.find({});
  }

  async findOne(id: number) {
    return await this.reservationsRepository.findOne({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return await this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return await this.reservationsRepository.findOneAndDelete({ id });
  }
}
