import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionLogsComponent } from './description-logs.component';

describe('DescriptionLogsComponent', () => {
  let component: DescriptionLogsComponent;
  let fixture: ComponentFixture<DescriptionLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
