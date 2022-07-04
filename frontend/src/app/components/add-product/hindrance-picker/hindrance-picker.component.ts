import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import {
  NgbDate, NgbDateAdapter,
  NgbTimeAdapter,
  NgbTimeStruct,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AvailabilityPickerComponent } from '../availability-picker/availability-picker.component';
import { addTimezoneOffset, isInteger, utcOffset } from '../../../../util/util';
import { NgbDateNativeAdapter, NgbTimeDateAdapter } from '../../../../util/nbgAdapter';


@Component({
  selector: 'app-hindrance-picker',
  templateUrl: './hindrance-picker.component.html',
  styleUrls: ['./hindrance-picker.component.css'],
  providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeDateAdapter },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
  ]
})
export class HindrancePickerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() markDisabled!: (date: NgbDate, current?: ({ year: number, month: number } | undefined)) => boolean;
  @Input() timeValidators?: ValidatorFn[];
  @Input() setFromTime?: Date;
  @Input() setToTime?: Date;

  @Output() newHindrance = new EventEmitter<Hindrance>();

  fromTimeControl!: FormControl;
  toTimeControl!: FormControl;

  hindrances: Hindrance[] = [];
  date: Date | null = null;
  fromTime: Date | null = null;
  toTime: Date | null = null;
  wholeDayHindrance: boolean = true;

  addTimeZoneOffset = addTimezoneOffset;

  constructor(private dateAdapter: NgbDateAdapter<Date>, private fb: FormBuilder) {
  }

  disable = (date: NgbDate) => true;

  ngOnInit(): void {
    this.timeValidators?.push(Validators.required);

    this.fromTime = this.setFromTime ? this.setFromTime : null;
    this.toTime = this.setToTime ? this.setToTime : null;

    console.log('timeValidators: %o', this.timeValidators);
    this.fromTimeControl = new FormControl('', this.timeValidators);
    this.toTimeControl = new FormControl('', this.timeValidators);
    if (!this.form) {
      this.form = this.fb.group({
        fromTimeControl: this.fromTimeControl,
        toTimeControl: this.toTimeControl
      });
    } else {
      this.form.addControl('fromTimeControl', this.fromTimeControl);
      this.form.addControl('toTimeControl', this.toTimeControl);
    }

    console.log(this.markDisabled);
  }

  addHindrance = (): void => {
    if (!this.date) {
      console.log('no hindrance selected');
      return;
    }
    const hindrance = new Hindrance(this.date!, this.fromTime, this.toTime, this.wholeDayHindrance);
    this.hindrances.push(hindrance);
    this.newHindrance.emit(hindrance);
    console.log('added hindrance: %o\nhindrances: %o', this.date, this.hindrances);
    this.date = null;
  }

  removeHindrance = (index: number): void => {
    this.hindrances.splice(index, 1);
    console.log('removed hindrance: %o\nhindrances: %o', this.hindrances);
  }

  toggleHindranceTime = (): void => {
    this.wholeDayHindrance = !this.wholeDayHindrance;
    this.fromTime = null;
    this.toTime = null;
    this.fromTimeControl.setErrors(null);
    this.toTimeControl.setErrors(null);
    console.log('wholeDayHindrance: %o', this.wholeDayHindrance);
  }


}

export class Hindrance {
  constructor(date: Date, fromTime: Date | null, toTime: Date | null, wholeDay: boolean) {
    this._date = date;
    this._fromTime = fromTime;
    this._toTime = toTime;
    this._wholeDay = wholeDay;
  }

  private _date: Date;

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  private _fromTime: Date | null;

  get fromTime(): Date | null {
    return this._fromTime;
  }

  set fromTime(value: Date | null) {
    this._fromTime = value;
  }

  private _toTime: Date | null;

  get toTime(): Date | null {
    return this._toTime;
  }

  set toTime(value: Date | null) {
    this._toTime = value;
  }

  private _wholeDay: boolean;

  get wholeDay(): boolean {
    return this._wholeDay;
  }

  set wholeDay(value: boolean) {
    this._wholeDay = value;
  }

  public static compare(a: Hindrance, b: Hindrance): number {
    if (a.date.getTime() === b.date.getTime()) {
      if (a.fromTime && b.fromTime) {
        return a.fromTime.getTime() - b.fromTime.getTime();
      } else {
        return 0;
      }
    } else {
      return a.date.getTime() - b.date.getTime();
    }
  }
}
