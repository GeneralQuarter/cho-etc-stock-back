import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSalesModule } from './point-of-sales/point-of-sales.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PointOfSalesModule],
})
export class AppModule {}
