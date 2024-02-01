import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common/types/notifications';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
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

      if (!this.notificationsService) {
        this.notificationsService =
          this.client.getService<NotificationsServiceClient>(
            NOTIFICATIONS_SERVICE_NAME,
          );
      }

      this.notificationsService.notifyEmail({
        email,
        text: `Your payment of $${amount} has completed successfully.`,
      });

      return paymentIntent;
    } catch (error) {
      console.error('stripe error', error);
      throw new UnprocessableEntityException('Error with the stripe payment');
    }
  }
}
