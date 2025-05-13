import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPhonelogsComponent } from './dialog-phonelogs.component';

describe('DialogPhonelogsComponent', () => {
  let component: DialogPhonelogsComponent;
  let fixture: ComponentFixture<DialogPhonelogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPhonelogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPhonelogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
