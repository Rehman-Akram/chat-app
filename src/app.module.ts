import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import configurations from './config/configurations';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import {
  BadRequestExceptionFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
} from './shared/exceptions';
import { APP_FILTER } from '@nestjs/core';

const globalFilters = [
  ConflictExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      cache: true,
    }),
    AppModule,
    UsersModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...globalFilters],
})
export class AppModule {}
