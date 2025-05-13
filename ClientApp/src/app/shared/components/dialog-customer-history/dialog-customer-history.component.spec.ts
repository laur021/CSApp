import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCustomerHistoryComponent } from './dialog-customer-history.component';

describe('DialogCustomerHistoryComponent', () => {
  let component: DialogCustomerHistoryComponent;
  let fixture: ComponentFixture<DialogCustomerHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCustomerHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCustomerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
