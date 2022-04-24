import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HenriAboutpageComponent } from './henriAboutpage.component';

describe('ProfilepageComponent', () => {
  let component: HenriAboutpageComponent;
  let fixture: ComponentFixture<HenriAboutpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HenriAboutpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HenriAboutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
