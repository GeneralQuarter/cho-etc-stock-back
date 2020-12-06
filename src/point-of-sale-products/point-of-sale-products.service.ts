import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSaleProductEntity } from './point-of-sale-product.entity';
import { Connection, InsertResult, Repository } from 'typeorm';
import { CreatePointOfSaleProductDto } from './create-point-of-sale-product.dto';
import { PointOfSaleEntity } from '../point-of-sales/point-of-sale.entity';

@Injectable()
export class PointOfSaleProductsService {
  constructor(
    @InjectRepository(PointOfSaleProductEntity)
    private pointOfSaleProductsRepo: Repository<PointOfSaleProductEntity>,
    private connection: Connection,
  ) {}

  async createMultiple(
    createPointOfSaleProductDtos: CreatePointOfSaleProductDto[],
    pointOfSale: PointOfSaleEntity,
  ): Promise<InsertResult> {
    const newPosPs = createPointOfSaleProductDtos.map((dto) =>
      this.pointOfSaleProductsRepo.create({
        ...dto,
        pointOfSale,
      }),
    );
    return this.connection
      .createQueryBuilder()
      .insert()
      .into(PointOfSaleProductEntity)
      .values(newPosPs)
      .orUpdate({ conflict_target: ['reference'], overwrite: ['designation'] })
      .execute();
  }

  async getProductPerRef(
    refs: string[],
    pointOfSale: PointOfSaleEntity,
  ): Promise<{ [ref: string]: PointOfSaleProductEntity }> {
    const products = await this.pointOfSaleProductsRepo.find({
      where: refs.map((r) => ({ reference: r, pointOfSale })),
    });
    const hash = {};
    for (const product of products) {
      hash[product.reference] = product;
    }
    return hash;
  }
}
