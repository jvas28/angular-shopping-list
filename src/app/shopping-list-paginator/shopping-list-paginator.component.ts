import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../service/product.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-shopping-list-paginator',
  templateUrl: './shopping-list-paginator.component.html',
  styleUrls: ['./shopping-list-paginator.component.sass'],
  providers:  [ ProductService ]
})
export class ShoppingListPaginatorComponent implements OnInit {
  links: any;
  currentPage: number;
  constructor(private service: ProductService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.params.subscribe(({id : page}) => {
      this.currentPage = page
      this.updateLinks();
    });
  }
  updateLinks() {
    const {meta} = this.service.getProducts(this.currentPage, 96);
    this.links = meta.links;
  }

}
