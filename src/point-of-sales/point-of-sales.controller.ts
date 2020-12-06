import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PointOfSalesService } from './point-of-sales.service';
import { PointOfSaleEntity } from './point-of-sale.entity';
import { CreatePointOfSaleDto } from './create-point-of-sale.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PointOfSaleProductsService } from '../point-of-sale-products/point-of-sale-products.service';
import { PointOfSaleProductEntity } from '../point-of-sale-products/point-of-sale-product.entity';
import { CreateProductsImportDto } from './create-products-import.dto';
import { PlaisirsFermiersApiService } from '../plaisirs-fermiers-api/plaisirs-fermiers-api.service';
import { CreateSalesImportDto } from './create-sales-import.dto';
import { PointOfSaleSalesService } from '../point-of-sale-sales/point-of-sale-sales.service';
import { PointOfSalesImportsService } from './point-of-sales-imports.service';

@ApiTags('point-of-sales')
@Controller('point-of-sales')
export class PointOfSalesController {
  constructor(
    private pointOfSalesService: PointOfSalesService,
    private pointOfSaleProductsService: PointOfSaleProductsService,
    private pointOfSaleSalesService: PointOfSaleSalesService,
    private plaisirsFermiersApiService: PlaisirsFermiersApiService,
    private pointOfSalesImportsService: PointOfSalesImportsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of point of sales' })
  @ApiOkResponse({
    description: 'List of all the point of sales',
    type: [PointOfSaleEntity],
  })
  async getAll(): Promise<PointOfSaleEntity[]> {
    return this.pointOfSalesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a point of sale by id' })
  @ApiOkResponse({
    description: 'Requested point of sale',
    type: PointOfSaleEntity,
  })
  async getOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PointOfSaleEntity> {
    const pos = await this.pointOfSalesService.findOne(id);

    if (!pos) {
      throw new NotFoundException(`Could not find point of sale with id ${id}`);
    }

    return pos;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing point of sale' })
  @ApiOkResponse({
    description: 'Updated point of sale',
    type: PointOfSaleEntity,
  })
  async updateOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createPointOfSaleDto: CreatePointOfSaleDto,
  ): Promise<PointOfSaleEntity> {
    const pos = await this.pointOfSalesService.findOne(id);

    if (!pos) {
      throw new NotFoundException(`Could not find point of sale with id ${id}`);
    }

    pos.name = createPointOfSaleDto.name;

    return this.pointOfSalesService.save(pos);
  }

  @Post()
  @ApiOperation({ summary: 'Create a point of sale' })
  @ApiCreatedResponse({
    description: 'Create point of sale',
    type: [PointOfSaleEntity],
  })
  async createOne(
    @Body() createPointOfSaleDto: CreatePointOfSaleDto,
  ): Promise<PointOfSaleEntity> {
    return this.pointOfSalesService.create(createPointOfSaleDto.name);
  }

  @Get(':id/products')
  async getProducts(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PointOfSaleProductEntity[]> {
    const pos = await this.pointOfSalesService.findOne(id, {
      relations: ['products'],
    });

    if (!pos) {
      throw new NotFoundException(`Could not find point of sale with id ${id}`);
    }

    return pos.products;
  }

  @Post(':id/products-import')
  async importProducts(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createProductImportDto: CreateProductsImportDto,
  ): Promise<any> {
    const pos = await this.pointOfSalesService.findOne(id);

    if (!pos) {
      throw new NotFoundException(`Could not find point of sale with id ${id}`);
    }

    return this.pointOfSalesImportsService.importProducts(
      pos,
      createProductImportDto.type,
    );
  }

  @Post(':id/sales-import')
  async importSales(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createSalesImportDto: CreateSalesImportDto,
  ): Promise<any> {
    const pos = await this.pointOfSalesService.findOne(id);

    if (!pos) {
      throw new NotFoundException(`Could not find point of sale with id ${id}`);
    }

    return this.pointOfSalesImportsService.importSales(
      pos,
      createSalesImportDto.type,
      createSalesImportDto.data,
    );
  }
}
