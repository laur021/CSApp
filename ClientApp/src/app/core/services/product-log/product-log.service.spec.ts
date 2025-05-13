import { TestBed } from '@angular/core/testing';

import { ProductLogService } from './product-log.service';

describe('ProductLogService', () => {
  let service: ProductLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
