import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSalesModule } from './point-of-sales/point-of-sales.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

const logger = new Logger('AppModule', true);

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.get<string>('SERVE_PATH');
        logger.log(`Serving front at: ${rootPath}`);
        return [
          {
            rootPath,
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
