import { Injectable } from '@angular/core';
import products from '../../assets/data/products.json'
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Array<any>;
  totalCount: number;
  constructor() {
    const { items } = products
    this.products = items;
    this.totalCount = items.length;
  }
  getCurrentPageItems(pageNumber: number, pageSize: number) {
    --pageNumber;
    return this.products.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }
  getPagesLinks(currentPage: number, pageNumber: number) {
    const pages = [...Array(pageNumber).keys()].map( v => v + 1);
    if (currentPage < 6) {
      return pages.slice(0, 5);
    }
    if (currentPage > (pageNumber - 5) ) {
      return pages.slice(-5);
    }

    return pages.slice(currentPage - 3, currentPage + 2);

  }
  getProducts( page: number = 1, pageSize: number = 96) {
    page = +page;
    const data = this.getCurrentPageItems(page, pageSize)
    const pageCount = Math.ceil(this.products.length / pageSize)
    const pagesLinks = this.getPagesLinks(page, pageCount)
    const meta = {
      count: pageCount,
      current: page,
      links: {
        pages: pagesLinks,
        prev: page > 1 ? page - 1 : null,
        next: (page < pageCount) ? page + 1 : null,
        last: page < (pageCount - 1) ? pageCount : null,
        first: page > 2 ? 1 : null,
      }
    }
    return { data, meta };
  }
}
