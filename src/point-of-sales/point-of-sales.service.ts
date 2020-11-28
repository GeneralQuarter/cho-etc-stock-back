import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSalesEntity } from './point-of-sales.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PointOfSalesService {
  constructor(
    @InjectRepository(PointOfSalesEntity)
    private pointOfSalesRepo: Repository<PointOfSalesEntity>,
  ) {}

  findAll(): Promise<PointOfSalesEntity[]> {
    return this.pointOfSalesRepo.find();
  }

  findOne(id: number): Promise<PointOfSalesEntity> {
    return this.pointOfSalesRepo.findOne(id);
  }

  create(name: string): Promise<PointOfSalesEntity> {
    const newPointOfSale = this.pointOfSalesRepo.create();
    newPointOfSale.name = name;
    return this.pointOfSalesRepo.save(newPointOfSale);
  }
}
