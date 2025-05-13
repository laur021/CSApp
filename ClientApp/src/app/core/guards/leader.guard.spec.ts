import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { leaderGuard } from './leader.guard';

describe('leaderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => leaderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
