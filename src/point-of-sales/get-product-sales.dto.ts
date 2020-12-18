import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductSalesDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
  })
  startDate: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
  })
  endDate: string;
}
