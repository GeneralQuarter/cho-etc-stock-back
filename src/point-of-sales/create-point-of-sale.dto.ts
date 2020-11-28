import { ApiProperty } from '@nestjs/swagger';

export class CreatePointOfSaleDto {
  @ApiProperty()
  name: string;
}
