import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfSaleProductEntity } from './point-of-sale-product.entity';
import { PointOfSaleProductsService } from './point-of-sale-products.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointOfSaleProductEntity])],
  providers: [PointOfSaleProductsService],
  exports: [PointOfSaleProductsService],
})
export class PointOfSaleProductsModule {}
