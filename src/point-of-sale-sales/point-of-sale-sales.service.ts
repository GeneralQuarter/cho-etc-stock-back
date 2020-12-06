import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSaleSaleEntity } from './point-of-sale-sale.entity';
import { Connection, InsertResult, Repository } from 'typeorm';
import { CreatePointOfSaleSaleDto } from './create-point-of-sale-sale.dto';
import { PointOfSaleProductEntity } from '../point-of-sale-products/point-of-sale-product.entity';

@Injectable()
export class PointOfSaleSalesService {
  constructor(
    @InjectRepository(PointOfSaleSaleEntity)
    private posSalesRepo: Repository<PointOfSaleSaleEntity>,
    private connection: Connection,
  ) {}

  async createMultiple(
    createPointOfSaleSaleDto: CreatePointOfSaleSaleDto[],
    posProductPerReference: { [ref: string]: PointOfSaleProductEntity },
  ): Promise<InsertResult> {
    const newPosSales = createPointOfSaleSaleDto.map((c) =>
      this.posSalesRepo.create({
        date: c.date,
        quantity: c.quantity,
        product: posProductPerReference[c.reference],
      }),
    );
    return this.connection
      .createQueryBuilder()
      .insert()
      .into(PointOfSaleSaleEntity)
      .values(newPosSales)
      .orUpdate({
        conflict_target: ['date', 'productId'],
        overwrite: ['quantity'],
      })
      .execute();
  }
}
