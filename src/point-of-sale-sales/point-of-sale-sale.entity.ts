import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PointOfSaleProductEntity } from '../point-of-sale-products/point-of-sale-product.entity';

@Entity({
  name: 'point_of_sale_sales',
})
@Unique(['date', 'product'])
export class PointOfSaleSaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'double' })
  quantity: number;

  @ManyToOne(() => PointOfSaleProductEntity, (p) => p.sales)
  product: PointOfSaleProductEntity;
}
