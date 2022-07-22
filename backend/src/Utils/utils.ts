import { IAvailability } from '../Models/Product';

export const utcOffset: number = new Date(0).getTime();
export const dayInMilliseconds: number = 24 * 60 * 60 * 1000;

export const isInteger = (value: unknown): value is number =>  {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

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


export const compareAvailabilty = (a: IAvailability, b: IAvailability): number => {
  const startA = a.startDate.getTime();
  const startB = b.startDate.getTime();
  const endA = a.endDate.getTime();
  const endB = b.endDate.getTime();

  const startDiff = startA - startB;
  if (!startDiff) {
    return endA - endB;
  }
  return startDiff;
};
