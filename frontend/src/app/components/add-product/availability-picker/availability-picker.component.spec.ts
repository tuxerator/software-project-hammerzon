import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityPickerComponent } from './availability-picker.component';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Availability } from '../../../models/Product';

describe('AvailabilityPickerComponent', () => {
  let component: AvailabilityPickerComponent;
  let fixture: ComponentFixture<AvailabilityPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailabilityPickerComponent],
      providers: [
        NgbDateParserFormatter,
        NgbCalendar,
        FormBuilder
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addAvailability() should add a new availability to #availabilities', () => {
    expect(component.availabilities.length)
      .withContext('empty at first')
      .toBe(0);
    component.onDateSelection(new NgbDate(2022, 7, 1));
    component.onDateSelection(new NgbDate(2022, 8, 1));

    expect(component.availabilities.length).withContext('should have 1 availability').toBe(1);
    expect(component.availabilities[0].availability).withContext('should have the correct availability')
      .toEqual(new Availability(new Date(2022, 7, 1), new Date(2022, 8, 1)));

  });
});
