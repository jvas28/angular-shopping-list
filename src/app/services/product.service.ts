import { Injectable } from '@angular/core';
import products from '../../assets/data/products.json';
import {BehaviorSubject, Subject } from 'rxjs';
import {filter} from 'rxjs/operators';
import {debug} from 'util';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataSource = {
    products: []
  };
  private filteredProducts;
  private currentPage = 1;
  private pageSize = 96;
  private products: BehaviorSubject<any>;
  private readonly globalCountValue: number;
  private currentCountValue: Subject<number>;
  private filters: Subject<{}>;
  get currentProductList() {
    return this.products.asObservable();
  }

  get globalCount() {
    return this.globalCountValue;
  }

  get currentCount() {
    return this.currentCountValue.asObservable();
  }

  get currentAppliedFilters() {
    return this.filters.asObservable();
  }
  normalizeFilterableAttributes(data) {
    return data.map(({custom_attributes: customAttributes, ...rest}) => {
      const normalizedAttributes = customAttributes.map((attr) => {
        let value = attr.value;
        if (attr.attribute_code === 'material') {
          value = attr.value.split(',');
        }
        if (attr.attribute_code === 'size') {
          value = [attr.value];
        }
        return { ...attr, value };
      });
      return {...rest, custom_attributes: normalizedAttributes };
    });
  }
  cleanFaultyData(data) {
    return data.filter((product) => product.price );
  }
  prepareData(data) {
    let result = this.cleanFaultyData(data);
    result = this.normalizeFilterableAttributes(result);
    return result;
  }
  constructor() {
    const { items } = products;
    const filteredItems = this.prepareData(items);
    this.dataSource.products = filteredItems;
    this.filteredProducts = filteredItems;
    this.globalCountValue = filteredItems.length;
    this.products = new BehaviorSubject({ data: [], page: [] });
    this.filters = new BehaviorSubject({
      price: [],
      categories: [],
      size: [],
      material: [],
    });
    this.currentCountValue = new BehaviorSubject(filteredItems.length);
  }
  getCurrentPageItems() {
    const pageNumber = this.currentPage - 1;
    const { pageSize } = this;
    const pageData = this.filteredProducts.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
    this.products.next({data: this.filteredProducts, page: [...pageData]});
    this.currentCountValue.next(this.filteredProducts.length);
  }
  updateCurrentPage( page: number = 1 ) {
    this.currentPage = page;
    this.getCurrentPageItems();
  }
  updateFilters(newFilterValue) {
    this.currentPage = 1;
    // @ts-ignore
    const filters = this.filters.getValue();
    const updateFilters = { ...filters, ...newFilterValue };
    this.filters.next(updateFilters);
    this.applyFilters();
    this.getCurrentPageItems();
  }
  applyFilters() {
    // @ts-ignore
    const filters = this.filters.getValue();
    const isFilteredByPrice = filters.price.length > 0;
    const isFilteredByCategories = filters.categories.length > 0;
    const isFilteredBySize = filters.size.length > 0;
    const isFilteredByMaterial = filters.material.length > 0;
    const isFiltered = isFilteredByPrice || isFilteredByCategories || isFilteredBySize || isFilteredByMaterial;
    if (!isFiltered) {this.filteredProducts = this.dataSource.products; return; }
    const data = this.dataSource.products;
    let result = data;
    if (filters.price.length > 0) {
      let allMin = null;
      let allMax = null;
      filters.price.map(([min, max]) => {
        if (allMin) {
          if (min < allMin) {
            allMin = min;
          }
        }else {
          allMin = min;
        }
        if (allMax) {
          if (max > allMax) {

          }
        } else {
          allMax = max;
        }

      });
      result = result.filter(({price}) => (price >= allMin && price <= allMax));
    }
    if (filters.categories.length > 0) {
      result = this.filterByAttribute('category_ids', filters.categories, result);
    }
    if (filters.size.length > 0) {
      result = this.filterByAttribute('size', filters.size, result);
    }
    if (filters.material.length > 0) {
      result = this.filterByAttribute('material', filters.material, result);
    }
    this.filteredProducts = result;
  }
  filterByAttribute(name, selected, result) {
    return result.filter(({custom_attributes: customAttributes = [] }) => {
      const attr = customAttributes.find((item) => item.attribute_code === name);
      if(attr) {
        const containsSelectedId = attr.value.filter((id) => selected.includes(+id)).length > 0;
        return containsSelectedId;
      } else {
        return false;
      }

    });
  }



}
