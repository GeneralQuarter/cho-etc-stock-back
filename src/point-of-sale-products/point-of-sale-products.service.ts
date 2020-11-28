import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSaleProductEntity } from './point-of-sale-product.entity';
import { Repository } from 'typeorm';
import { CreatePointOfSaleProductDto } from './create-point-of-sale-product.dto';
import { PointOfSaleEntity } from '../point-of-sales/point-of-sale.entity';

@Injectable()
export class PointOfSaleProductsService {
  constructor(
    @InjectRepository(PointOfSaleProductEntity)
    private pointOfSaleProductsRepo: Repository<PointOfSaleProductEntity>,
  ) {}

  async findAll(): Promise<PointOfSaleProductEntity[]> {
    return this.pointOfSaleProductsRepo.find();
  }

  async findOne(id: number): Promise<PointOfSaleProductEntity> {
    return this.pointOfSaleProductsRepo.findOne(id);
  }

  async create(
    createPointOfSaleProductDto: CreatePointOfSaleProductDto,
    pointOfSale: PointOfSaleEntity,
  ): Promise<PointOfSaleProductEntity> {
    const newPosP = this.pointOfSaleProductsRepo.create({
      ...createPointOfSaleProductDto,
      pointOfSale,
    });
    return this.pointOfSaleProductsRepo.save(newPosP);
  }

  async createMultiple(
    createPointOfSaleProductDtos: CreatePointOfSaleProductDto[],
    pointOfSale: PointOfSaleEntity,
  ): Promise<PointOfSaleProductEntity[]> {
    const newPosPs = createPointOfSaleProductDtos.map((dto) =>
      this.pointOfSaleProductsRepo.create({
        ...dto,
        pointOfSale,
      }),
    );
    return this.pointOfSaleProductsRepo.save(newPosPs);
  }
}
