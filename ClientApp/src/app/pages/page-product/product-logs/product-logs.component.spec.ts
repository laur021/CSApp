import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLogsComponent } from './product-logs.component';

describe('ProductLogsComponent', () => {
  let component: ProductLogsComponent;
  let fixture: ComponentFixture<ProductLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
