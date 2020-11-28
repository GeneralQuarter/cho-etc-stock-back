import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PointOfSaleEntity } from '../point-of-sales/point-of-sale.entity';

@Entity({
  name: 'point_of_sale_products',
})
@Unique(['reference', 'pointOfSale'])
export class PointOfSaleProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  designation: string;

  @Column()
  reference: string;

  @Column({ nullable: true })
  unitPreTaxPrice: number;

  @ManyToOne(() => PointOfSaleEntity, (pos) => pos.products)
  pointOfSale: PointOfSaleEntity;
}
