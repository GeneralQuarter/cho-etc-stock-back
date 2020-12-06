import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesImportData {
  @ApiProperty()
  startTimestamp: number;

  @ApiProperty()
  endTimestamp: number;
}
