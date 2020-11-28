import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSaleEntity } from './point-of-sale.entity';
import { PointOfSalesService } from './point-of-sales.service';
import { PointOfSalesController } from './point-of-sales.controller';
import { PointOfSaleProductsModule } from '../point-of-sale-products/point-of-sale-products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointOfSaleEntity]),
    PointOfSaleProductsModule,
  ],
  providers: [PointOfSalesService],
  controllers: [PointOfSalesController],
  exports: [PointOfSalesService],
})
export class PointOfSalesModule {}
