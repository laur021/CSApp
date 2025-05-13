import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmaillogsComponent } from './dialog-emaillogs.component';

describe('DialogEmaillogsComponent', () => {
  let component: DialogEmaillogsComponent;
  let fixture: ComponentFixture<DialogEmaillogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEmaillogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEmaillogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
