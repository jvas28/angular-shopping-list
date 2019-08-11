import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListPaginatorComponent } from './shopping-list-paginator.component';

describe('ShoppingListPaginatorComponent', () => {
  let component: ShoppingListPaginatorComponent;
  let fixture: ComponentFixture<ShoppingListPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
