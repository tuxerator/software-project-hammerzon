import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CedricwieseComponent } from './cedricwiese.component';

describe('AboutComponent', () => {
  let component: CedricwieseComponent;
  let fixture: ComponentFixture<CedricwieseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CedricwieseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CedricwieseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
