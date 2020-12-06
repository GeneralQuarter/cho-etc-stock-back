import { ProductImport } from './product-import';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsImportDto {
  @ApiProperty({
    enum: ProductImport,
  })
  type: ProductImport;
}
