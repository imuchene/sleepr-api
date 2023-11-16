import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ServicesEnum } from '@app/common/constants/services.enum';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(ServicesEnum.NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        payment_method: 'pm_card_visa',
        currency: 'usd',
        confirm: true,
        payment_method_types: ['card'],
      });

      this.notificationsService.emit('notify_email', { email });

      return paymentIntent;
    } catch (error) {
      console.error('stripe error', error);
      throw new UnprocessableEntityException('Error with the stripe payment');
    }
  }
}
