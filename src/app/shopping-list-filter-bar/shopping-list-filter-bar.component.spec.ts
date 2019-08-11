import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListFilterBarComponent } from './shopping-list-filter-bar.component';

describe('ShoppingListFilterBarComponent', () => {
  let component: ShoppingListFilterBarComponent;
  let fixture: ComponentFixture<ShoppingListFilterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListFilterBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
