import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatableInputComponent } from './validatable-input.component';

describe('ValidatableInputComponent', () => {
  let component: ValidatableInputComponent;
  let fixture: ComponentFixture<ValidatableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatableInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
