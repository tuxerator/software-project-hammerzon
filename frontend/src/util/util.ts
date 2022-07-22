import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Availability } from '../app/models/Product';
import { FormGroup } from '@angular/forms';

export const utcOffset: number = new Date(0).getTime();
export const dayInMilliseconds: number = 24 * 60 * 60 * 1000;

export const isInteger = (value: unknown): value is number => {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

export const ngbDateToDate = (ngbDate: NgbDate | null): Date | null => {
  return ngbDate ? new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day)) : null;
};

export const getDayTime = (date: Date): number => {
  return date.getUTCHours() * 60 * 60 * 1000 + date.getUTCMinutes() * 60 * 1000 + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds();
};


/**
 *
 * @param date
 * @return date with utc offset
 */
export const addTimezoneOffset = (date: Date): Date => {
  return new Date(date.getTime() + utcOffset);
};

/**
 * Compares two dates without taking the time into account.
 * @return 0 if the dates are equal, -1 if date1 is before date2, 1 if date1 is after date2
 */
export const compareDates = (date1: Date, date2: Date): number => {
  const date1WithoutTime = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const date2WithoutTime = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.sign(date1WithoutTime - date2WithoutTime);
};

export const createAppointment = (startDate: Date, duration: number, defaultTimeFrame: Availability): Availability => {
  console.log('startDate: %o, duration: %o, defaultTimeFrame: %o', startDate, duration, defaultTimeFrame);
  const endDate = new Date(startDate);
  const defaultDiff = defaultTimeFrame.startDate.getTime() + dayInMilliseconds - defaultTimeFrame.endDate.getTime();
  while (defaultTimeFrame.endDate.getTime() - (endDate.getUTCHours() * 60 * 60 * 1000 + endDate.getUTCMinutes() * 60 * 1000) < duration) {
    duration = duration - (defaultTimeFrame.endDate.getTime() - (endDate.getUTCHours() * 60 * 60 * 1000 + endDate.getUTCMinutes() * 60 * 1000));

    endDate.setTime(endDate.getTime() + defaultTimeFrame.endDate.getTime() - (endDate.getUTCHours() * 60 * 60 * 1000 + endDate.getUTCMinutes() * 60 * 1000) + defaultDiff);
    console.log('endDate: %o, duration: %o', endDate, new Date(duration));
  }

  endDate.setTime(endDate.getTime() + duration);
  console.log('endDate: %o', endDate);
  return new Availability(startDate, endDate);
};

// update the validity of the controls in the group
export const updateGroupValidity = (formGroup: FormGroup): void => {
  console.log('update validity for: %o', formGroup);
  Object.keys(formGroup.controls).forEach(key => formGroup.controls[key].updateValueAndValidity());
  console.log('Updated Validity for ', formGroup.controls);
};
