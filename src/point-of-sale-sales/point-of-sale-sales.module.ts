import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSaleSaleEntity } from './point-of-sale-sale.entity';
import { PointOfSaleSalesService } from './point-of-sale-sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointOfSaleSaleEntity])],
  providers: [PointOfSaleSalesService],
  exports: [PointOfSaleSalesService],
})
export class PointOfSaleSalesModule {}
