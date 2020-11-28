import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PointOfSalesService } from './point-of-sales.service';
import { PointOfSalesEntity } from './point-of-sales.entity';
import { CreatePointOfSaleDto } from './create-point-of-sale.dto';

@Controller('point-of-sales')
export class PointOfSalesController {
  constructor(private pointOfSalesService: PointOfSalesService) {}

  @Get()
  async getAll(): Promise<PointOfSalesEntity[]> {
    return this.pointOfSalesService.findAll();
  }

  @Get('id')
  async getOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PointOfSalesEntity> {
    return this.pointOfSalesService.findOne(id);
  }

  @Post()
  createOne(
    @Body() createPointOfSaleDto: CreatePointOfSaleDto,
  ): Promise<PointOfSalesEntity> {
    return this.pointOfSalesService.create(createPointOfSaleDto.name);
  }
}
