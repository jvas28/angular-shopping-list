import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass'],
})
export class ShoppingListComponent implements OnInit {

  public products;
  currentPage: number;
  constructor(private productService: ProductService, private route: ActivatedRoute) {
    this.products = productService.currentProductList.subscribe(({page}) => {
      this.products = page;
    });
  }
  ngOnInit() {
    this.route.params.subscribe(({id: page}) => {
      this.currentPage = +page || 1;
      this.productService.updateCurrentPage(page);
    });
  }
}
