import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HindrancePickerComponent } from './hindrance-picker.component';

describe('HindrancePickerComponent', () => {
  let component: HindrancePickerComponent;
  let fixture: ComponentFixture<HindrancePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HindrancePickerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HindrancePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
