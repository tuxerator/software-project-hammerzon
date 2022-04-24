import { TestBed } from '@angular/core/testing';

import { HenriAboutService } from './henriAbout.service';

describe('ProfileService', () => {
  let service: HenriAboutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HenriAboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
