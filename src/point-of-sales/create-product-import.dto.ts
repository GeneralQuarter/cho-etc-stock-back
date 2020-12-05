import { ProductImport } from './product-import';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImportDto {
  @ApiProperty({
    enum: ProductImport,
  })
  type: ProductImport;
}
