import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-list-paginator',
  templateUrl: './shopping-list-paginator.component.html',
  styleUrls: ['./shopping-list-paginator.component.sass'],
})
export class ShoppingListPaginatorComponent implements OnInit {
  links: any;
  currentPage: number;
  pageSize = 96;
  currentCount: number;
  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router ) {
    this.currentPage = 1;
  }
  ngOnInit() {
    this.productService.currentCount.subscribe((count: number) => {
      if(count !== this.currentCount) {
        this.currentCount = count;
        this.router.navigateByUrl('/');
      }
      this.updateLinks();
    });
    this.route.params.subscribe(({id : page}) => {
      this.currentPage = +page
      this.updateLinks();
    });

  }
  getPagesLinks() {
    const { currentPage, currentCount, pageSize } = this;
    const pageCount = Math.ceil(currentCount / pageSize);
    const pages = [...Array(pageCount).keys()].map( v => v + 1);
    if (currentPage < 6) {
      return pages.slice(0, 5);
    }
    if (currentPage > (pageCount - 5) ) {
      return pages.slice(-5);
    }
    return pages.slice(currentPage - 3, currentPage + 2);
  }
  updateLinks() {
    const { currentPage } = this
    const pageCount = Math.ceil(this.currentCount / this.pageSize);
    const pages = this.getPagesLinks();
    const prev = currentPage > 1 ? currentPage - 1 : null;
    const next = (currentPage < pageCount) ? currentPage + 1 : null;
    const last = currentPage < (pageCount - 1) ? pageCount : null;
    const first = currentPage > 2 ? 1 : null;
    this.links = {
      pages,
      prev,
      next,
      last,
      first,
    };

  }

}
