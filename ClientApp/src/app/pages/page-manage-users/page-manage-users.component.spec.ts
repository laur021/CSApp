import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageManageUsersComponent } from './page-manage-users.component';

describe('PageManageUsersComponent', () => {
  let component: PageManageUsersComponent;
  let fixture: ComponentFixture<PageManageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageManageUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
