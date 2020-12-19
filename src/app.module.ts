import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSalesModule } from './point-of-sales/point-of-sales.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return [
          {
            rootPath: join(__dirname, configService.get<string>('SERVE_PATH')),
          },
        ];
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    PointOfSalesModule,
  ],
})
export class AppModule {}
