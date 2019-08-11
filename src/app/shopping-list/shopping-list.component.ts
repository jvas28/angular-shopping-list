import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass'],
  providers:  [ ProductService ],
})
export class ShoppingListComponent implements OnInit {

  products: Array<any>;
  productProvider;
  currentPage: number;
  meta: any;

  constructor(private service: ProductService, private route: ActivatedRoute) {
    this.productProvider = service;
    const {data, meta} = service.getProducts();
    this.products = data;
    this.meta = meta;
  }

  ngOnInit() {
    this.route.params.subscribe(({id: page}) => {
      this.currentPage = +page || 1
      const { data, meta} = this.productProvider.getProducts(page, 96);
      this.products = data;
      this.meta = meta;
    });

  }
}
