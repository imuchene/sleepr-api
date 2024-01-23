import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.getOrThrow<string>('MYSQL_HOST'),
        port: configService.getOrThrow<string>('MYSQL_PORT'),
        database: configService.getOrThrow<string>('MYSQL_DATABASE'),
        username: configService.getOrThrow<string>('MYSQL_USERNAME'),
        password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
        synchronize: configService.getOrThrow<boolean>('MYSQL_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
