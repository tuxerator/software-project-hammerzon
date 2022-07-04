import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { isInteger } from './util';

/**
 *  NgbTimeAdapter implementation that uses native JavaScript dates as user time model
 */
@Injectable()
export class NgbTimeDateAdapter extends NgbTimeAdapter<Date> {
  /**
   * Converts from Date to NgbDateStruct
   */
  override fromModel(value: Date | null): NgbTimeStruct | null {
    if (!value) {
      return null;
    }
    return {
      hour: value.getUTCHours(),
      minute: value.getUTCMinutes(),
      second: value.getUTCSeconds()
    };
  }

  /**
   * Converts from NgbTimeStruct to Date
   */
  override toModel(time: NgbTimeStruct | null): Date | null {
    const timeUTC = time != null ? Date.UTC(1970, 0, 1, time.hour, time.minute, time.second) : null;
    return timeUTC != null ? new Date(timeUTC) : null;
  }
}

/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  /**
   * Converts a native `Date` to a `NgbDateStruct`.
   */
  fromModel(date: Date | null): NgbDateStruct | null {
    return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
  }

  /**
   * Converts a `NgbDateStruct` to a native `Date`.
   */
  toModel(date: NgbDateStruct | null): Date | null {
    return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
      null;
  }

  protected _fromNativeDate(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  protected _toNativeDate(date: NgbDateStruct): Date {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    // avoid 30 -> 1930 conversion
    jsDate.setFullYear(date.year);
    return jsDate;
  }
}
