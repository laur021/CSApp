import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageActivityLogComponent } from './page-activity-log.component';

describe('PageActivityLogComponent', () => {
  let component: PageActivityLogComponent;
  let fixture: ComponentFixture<PageActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageActivityLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
