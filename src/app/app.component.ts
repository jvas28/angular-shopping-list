import {Component, OnInit} from '@angular/core';
import {ProductService} from './services/product.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers:  [ ProductService ],
})
export class AppComponent implements OnInit {
  title = 'MyShoppingList';
  constructor(private service: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

}
