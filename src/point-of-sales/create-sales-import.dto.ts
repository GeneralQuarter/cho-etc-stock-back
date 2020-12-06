import { SaleImport } from './sale-import';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSalesImportData } from './create-sales-import-data';

export class CreateSalesImportDto {
  @ApiProperty({
    enum: SaleImport,
  })
  type: SaleImport;

  @ApiProperty()
  data: CreateSalesImportData;
}
