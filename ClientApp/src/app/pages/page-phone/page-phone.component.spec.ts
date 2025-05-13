import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePhoneComponent } from './page-phone.component';

describe('PagePhoneComponent', () => {
  let component: PagePhoneComponent;
  let fixture: ComponentFixture<PagePhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
