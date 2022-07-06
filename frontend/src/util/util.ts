import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export const utcOffset: number = new Date(0).getTime();

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export const ngbDateToDate = (ngbDate: NgbDate | null): Date | null => {
  return ngbDate ? new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day)) : null;
}

export const addTimezoneOffset = (date: Date): Date => {
  return new Date(date.getTime() + utcOffset);
}

/**
 * Compares two dates without taking the time into account.
 * @return 0 if the dates are equal, -1 if date1 is before date2, 1 if date1 is after date2
 */
export const compareDates = (date1: Date, date2: Date): number => {
  const date1WithoutTime = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const date2WithoutTime = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.sign(date1WithoutTime - date2WithoutTime);
}
