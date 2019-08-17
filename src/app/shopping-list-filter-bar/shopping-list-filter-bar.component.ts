import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../services/product.service';

interface Filter {
  price: Array<Array<number>>;
  categories: Array<number>;
  size: Array<number>;
  material: Array<number>;
}

@Component({
  selector: 'app-shopping-list-filter-bar',
  templateUrl: './shopping-list-filter-bar.component.html',
  styleUrls: ['./shopping-list-filter-bar.component.sass'],
})
export class ShoppingListFilterBarComponent implements OnInit {
  public filterStructure;
  private selected: Filter =  {
    price: [],
    categories: [],
    size: [],
    material: [],
  };
  public showFilters = false;
  constructor(private productService: ProductService) {
    this.filterStructure =  {
      price: [],
      categories: [],
      size: [],
      material: [],
    };
  }
  toggleFilterView() {
    this.showFilters = !this.showFilters;
  }
  onPriceSelect([min, max]) {
    const price = this.selected.price;
    const range = [min, max];
    const isIncluded = price.filter(([minR, maxR]) => (minR === min && maxR === max)).length > 0;
    const r =  isIncluded ? price.filter(([minR, maxR]) => {
      return minR !== min && maxR !== max;
    }) : [ ...price, range];
    this.productService.updateFilters({price: r });
  }
  onAttributeSelect(type, value) {
    const selected = this.selected[type];
    if (selected.includes(value)) {
      this.productService.updateFilters({ [type]: selected.filter((v) => v !== value) });
    } else {
      this.productService.updateFilters({ [type]: [...selected, value] });
    }
  }
  ngOnInit() {
    this.productService.currentProductList.subscribe(({data}) => {
      this.filterStructure = this.getFilters(data);
    });
    this.productService.currentAppliedFilters.subscribe( (filters: Filter) => {
      this.selected = filters;
    });

  }

  getFilters(products) {
    const f = {
      price: this.getPricesRanges(products),
      categories: this.getAttributeFilter('category_ids', products),
      size: this.getAttributeFilter('size', products),
      material: this.getAttributeFilter('material', products),
    };
    return f;
  }
  getAttributeFilter(code , products) {
      const result = [];
      const values  = products.map(({custom_attributes: customAttributes}) => {
        customAttributes.map((attr) => {
          if (attr.attribute_code === code) {
            attr.value.map((id) => {
              if (!result.includes(+id)) {
                result.push(+id);
              }
            });
          }
        });

      });
      return result.sort((a, b) => a - b);

  }

  getPricesRanges(filteredProducts) {
    const prices = [...filteredProducts.map(({ price }) => price)];
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const ranges = [];
    if (min < 20) { ranges.push([0, 20]); }
    if (!(min >= 50 || max <= 20)) { ranges.push([20, 50]); }
    if (max > 50) { ranges.push([50, 200]); }


    return ranges;
  }

  isPriceSelected([min, max]) {
    const price = this.selected.price;
    return price.filter(([minR, maxR]) => (minR === min && maxR === max)).length > 0;
  }
  isAttributeSelected(type, value) {
    const selected = this.selected[type];
    if (selected) {
      return selected.includes(value);
    } else {
      return false;
    }
  }
}
