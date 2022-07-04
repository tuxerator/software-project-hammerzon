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
