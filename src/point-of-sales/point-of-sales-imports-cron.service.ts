import { Injectable, Logger } from '@nestjs/common';
import { PointOfSalesImportsService } from './point-of-sales-imports.service';
import { PointOfSalesService } from './point-of-sales.service';
import { ProductImport } from './product-import';
import { ConfigService } from '@nestjs/config';
import { SaleImport } from './sale-import';
import { getUnixTime, startOfYesterday } from 'date-fns';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PointOfSalesImportsCronService {
  private readonly logger = new Logger(
    PointOfSalesImportsCronService.name,
    true,
  );
  private readonly plaisirsFermiersPointOfSaleId: number;

  constructor(
    private pointOfSalesService: PointOfSalesService,
    private pointOfSalesImportsService: PointOfSalesImportsService,
    private configService: ConfigService,
  ) {
    this.plaisirsFermiersPointOfSaleId = this.configService.get<number>(
      'PF_ID',
    );
  }

  @Cron('0 0 4 * * *')
  async importPlaisirsFermiersSalesPreviousDay() {
    return this.runCron('importPlaisirsFermiersSalesPreviousDay', async () => {
      const pos = await this.pointOfSalesService.findOne(
        this.plaisirsFermiersPointOfSaleId,
      );
      const date = startOfYesterday();
      return this.pointOfSalesImportsService.importSales(
        pos,
        SaleImport.PlaisirsFermiers,
        {
          startTimestamp: getUnixTime(date),
          endTimestamp: getUnixTime(date),
        },
      );
    });
  }

  @Cron('0 0 3 * * 7')
  async importPlaisirsFermiersProductsWeekly() {
    return this.runCron('importPlaisirsFermiersProductsWeekly', async () => {
      const pos = await this.pointOfSalesService.findOne(
        this.plaisirsFermiersPointOfSaleId,
      );
      return this.pointOfSalesImportsService.importProducts(
        pos,
        ProductImport.PlaisirsFermiers,
      );
    });
  }

  async runCron(name: string, fnc: () => Promise<any>) {
    this.logger.log(`Starting ${name}...`);
    let result;

    try {
      result = await fnc();
    } catch (e) {
      this.logger.error(`Failed ${name}: ${e.message}`, e.trace);
    }
    this.logger.log(`${name} ended`);
    return result;
  }
}
