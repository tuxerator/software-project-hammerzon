import { TestBed } from '@angular/core/testing';

import { SophieunterfranzService } from './sophieunterfranz.service';

describe('SophieunterfranzService', () => {
  let service: SophieunterfranzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SophieunterfranzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
