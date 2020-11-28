import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSaleEntity } from './point-of-sale.entity';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class PointOfSalesService {
  constructor(
    @InjectRepository(PointOfSaleEntity)
    private pointOfSalesRepo: Repository<PointOfSaleEntity>,
  ) {}

  findAll(): Promise<PointOfSaleEntity[]> {
    return this.pointOfSalesRepo.find();
  }

  findOne(
    id: number,
    options?: FindOneOptions<PointOfSaleEntity>,
  ): Promise<PointOfSaleEntity> {
    return this.pointOfSalesRepo.findOne(id, options);
  }

  save(pointOfSale: PointOfSaleEntity): Promise<PointOfSaleEntity> {
    return this.pointOfSalesRepo.save(pointOfSale);
  }

  create(name: string): Promise<PointOfSaleEntity> {
    const newPointOfSale = this.pointOfSalesRepo.create();
    newPointOfSale.name = name;
    return this.pointOfSalesRepo.save(newPointOfSale);
  }
}
