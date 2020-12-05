import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointOfSaleProductDto {
  @ApiProperty()
  reference: string;

  @ApiPropertyOptional()
  designation: string;
}
