import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWorkloadStatsComponent } from './page-workload-stats.component';

describe('PageWorkloadStatsComponent', () => {
  let component: PageWorkloadStatsComponent;
  let fixture: ComponentFixture<PageWorkloadStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWorkloadStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWorkloadStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
