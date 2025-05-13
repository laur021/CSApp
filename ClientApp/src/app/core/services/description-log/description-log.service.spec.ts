import { TestBed } from '@angular/core/testing';

import { DescriptionLogService } from './description-log.service';

describe('DescriptionLogService', () => {
  let service: DescriptionLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptionLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
