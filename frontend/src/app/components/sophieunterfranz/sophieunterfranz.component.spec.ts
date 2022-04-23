import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SophieunterfranzComponent } from './sophieunterfranz.component';

describe('SophieunterfranzComponent', () => {
  let component: SophieunterfranzComponent;
  let fixture: ComponentFixture<SophieunterfranzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SophieunterfranzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SophieunterfranzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
