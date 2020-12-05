import { PfProduct } from './pf-product';

export interface PfProductsPage {
  products: PfProduct[];
  hasNext: boolean;
}
