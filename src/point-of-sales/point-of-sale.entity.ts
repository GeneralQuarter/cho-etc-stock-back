import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PointOfSaleProductEntity } from '../point-of-sale-products/point-of-sale-product.entity';

@Entity({
  name: 'point_of_sales',
})
export class PointOfSaleEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(
    () => PointOfSaleProductEntity,
    (pointOfSaleProduct) => pointOfSaleProduct.pointOfSale,
  )
  products: PointOfSaleProductEntity[];
}
