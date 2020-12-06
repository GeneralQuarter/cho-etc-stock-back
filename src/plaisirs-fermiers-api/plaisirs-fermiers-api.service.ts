import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PfProduct } from './pf-product';
import { PfProductsPage } from './pf-products-page';
import { parse } from 'node-html-parser';
import { PfSale } from './pf-sale';
import { eachDayOfInterval, fromUnixTime, getUnixTime } from 'date-fns';

@Injectable()
export class PlaisirsFermiersApiService {
  private readonly baseUrl: string = '';
  private readonly username: string = '';
  private readonly password: string = '';
  private readonly code: string = '';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('PF_BASE_URL');
    this.username = this.configService.get<string>('PF_USERNAME');
    this.password = this.configService.get<string>('PF_PASSWORD');
    this.code = this.configService.get<string>('PF_CODE');
  }

  async login(): Promise<string[]> {
    return this.httpService
      .post(
        `${this.baseUrl}/index.php?page=login`,
        `UserName=${this.username}&Password=${this.password}`,
      )
      .toPromise()
      .then((res) => res.headers['set-cookie']);
  }

  async fetchProducts(): Promise<PfProduct[]> {
    const cookies = await this.login();
    const products: PfProduct[] = [];
    let page = -1;
    let currentProductPage: PfProductsPage = null;

    do {
      page += 1;
      currentProductPage = await this.fetchProductsPage(cookies, page);
      products.push(...currentProductPage.products);
    } while (currentProductPage.hasNext);

    return products;
  }

  async fetchSalesForInterval(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<PfSale[]> {
    console.log(startTimestamp, endTimestamp);
    const cookies = await this.login();
    const days = eachDayOfInterval({
      start: fromUnixTime(startTimestamp),
      end: fromUnixTime(endTimestamp),
    });
    const sales: PfSale[] = [];
    for (const day of days) {
      sales.push(
        ...(await this.fetchSalesForTimestamp(cookies, getUnixTime(day))),
      );
    }
    return sales;
  }

  async fetchSalesForTimestamp(
    cookies: string[],
    timestamp: number,
  ): Promise<PfSale[]> {
    return this.httpService
      .post<string>(
        `${this.baseUrl}/modules/page_producteur/ajax/fou_ventes.php`,
        `code=${this.code}&date=${timestamp}&type_ventes=cumul&type_v=`,
        {
          headers: {
            Cookie: cookies.join('; '),
          },
        },
      )
      .toPromise()
      .then((res) => this.parsePfSales(res.data));
  }

  async fetchProductsPage(
    cookies: string[],
    page: number,
  ): Promise<PfProductsPage> {
    return this.httpService
      .post<string>(
        `${this.baseUrl}/modules/page_producteur/ajax/fou_prod.php`,
        `code=${this.code}&page=${page}`,
        {
          headers: {
            Cookie: cookies.join('; '),
          },
        },
      )
      .toPromise()
      .then((res) => this.parsePfProductPage(res.data));
  }

  parsePfProductPage(data: string): PfProductsPage {
    const root = parse(data);
    const tbody = root.querySelector('tbody');

    if (!tbody) {
      return { products: [], hasNext: false };
    }

    const page: PfProductsPage = { products: [], hasNext: false };

    const trs = tbody.querySelectorAll('tr');
    for (const tr of trs) {
      const [refNode, nameNode] = tr.querySelectorAll('td');
      page.products.push({ ref: refNode.rawText, name: nameNode.rawText });
    }

    page.hasNext = root.querySelector('li.next') !== null;

    return page;
  }

  parsePfSales(data: string): PfSale[] {
    const root = parse(data);
    const tbody = root.querySelector('tbody');

    if (!tbody) {
      return [];
    }

    const sales: PfSale[] = [];

    const trs = tbody.querySelectorAll('tr');
    for (const tr of trs) {
      const [dateNode, refNode, , qtyNode] = tr.querySelectorAll('td');
      sales.push({
        date: dateNode.rawText,
        ref: refNode.rawText,
        quantity: parseFloat(qtyNode.rawText),
      });
    }

    return sales;
  }
}
