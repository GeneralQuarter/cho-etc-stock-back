import { SaleImport } from './sale-import';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesImportDto {
  @ApiProperty({
    enum: SaleImport,
  })
  type: SaleImport;

  @ApiProperty()
  data: {
    startTimestamp: number;
    endTimestamp: number;
  };
}
