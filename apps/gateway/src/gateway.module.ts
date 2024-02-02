import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger/logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriverConfig, ApolloGatewayDriver } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL'),
              },
            ],
          }),
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
