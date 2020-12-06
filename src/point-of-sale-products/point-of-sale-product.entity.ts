import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PointOfSaleEntity } from '../point-of-sales/point-of-sale.entity';
import { PointOfSaleSaleEntity } from '../point-of-sale-sales/point-of-sale-sale.entity';

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

  @ManyToOne(() => PointOfSaleEntity, (pos) => pos.products)
  pointOfSale: PointOfSaleEntity;

  @OneToMany(() => PointOfSaleSaleEntity, (s) => s.product)
  sales: PointOfSaleSaleEntity[];
}
