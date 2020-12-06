import { Injectable } from '@nestjs/common';
import { PointOfSaleEntity } from './point-of-sale.entity';
import { ProductImport } from './product-import';
import { PlaisirsFermiersApiService } from '../plaisirs-fermiers-api/plaisirs-fermiers-api.service';
import { PointOfSaleProductsService } from '../point-of-sale-products/point-of-sale-products.service';
import { PointOfSaleSalesService } from '../point-of-sale-sales/point-of-sale-sales.service';
import { SaleImport } from './sale-import';
import { CreateSalesImportData } from './create-sales-import-data';
import { parse } from 'date-fns';

@Injectable()
export class PointOfSalesImportsService {
  constructor(
    private plaisirsFermiersApiService: PlaisirsFermiersApiService,
    private pointOfSaleProductsService: PointOfSaleProductsService,
    private pointOfSaleSalesService: PointOfSaleSalesService,
  ) {}

  async importProducts(pos: PointOfSaleEntity, type: ProductImport) {
    switch (type) {
      case ProductImport.PlaisirsFermiers:
        const pfProducts = await this.plaisirsFermiersApiService.fetchProducts();
        return this.pointOfSaleProductsService.createMultiple(
          pfProducts.map((p) => ({ reference: p.ref, designation: p.name })),
          pos,
        );
      default:
        return null;
    }
  }

  async importSales(
    pos: PointOfSaleEntity,
    type: SaleImport,
    data: CreateSalesImportData,
  ) {
    switch (type) {
      case SaleImport.PlaisirsFermiers:
        const sales = await this.plaisirsFermiersApiService.fetchSalesForInterval(
          data.startTimestamp,
          data.endTimestamp,
        );
        const posProductPerRef = await this.pointOfSaleProductsService.getProductPerRef(
          sales.map((s) => s.ref),
          pos,
        );
        return this.pointOfSaleSalesService.createMultiple(
          sales.map((s) => ({
            reference: s.ref,
            quantity: s.quantity,
            date: parse(s.date, 'd/M/yyyy', new Date()),
          })),
          posProductPerRef,
        );
      default:
        return null;
    }
  }
}
