import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  async createCharge({ amount }: CreateChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        payment_method: 'pm_card_visa',
        currency: 'usd',
        confirm: true,
        payment_method_types: ['card'],
      });

      return paymentIntent;
    } catch (error) {
      console.error('stripe error', error);
      throw new UnprocessableEntityException('Error with the stripe payment');
    }
  }
}
