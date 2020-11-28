import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'point_of_sales',
})
export class PointOfSalesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
