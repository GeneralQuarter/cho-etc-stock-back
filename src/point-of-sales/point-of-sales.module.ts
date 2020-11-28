import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSalesEntity } from './point-of-sales.entity';
import { PointOfSalesService } from './point-of-sales.service';
import { PointOfSalesController } from './point-of-sales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PointOfSalesEntity])],
  providers: [PointOfSalesService],
  controllers: [PointOfSalesController],
  exports: [PointOfSalesService],
})
export class PointOfSalesModule {}
