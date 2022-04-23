import { TestBed } from '@angular/core/testing';

import { LukasErneService } from './lukas-erne.service';

describe('LukasErneService', () => {
  let service: LukasErneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LukasErneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
