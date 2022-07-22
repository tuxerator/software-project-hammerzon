import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NgbDate, NgbDateAdapter,
  NgbTimeAdapter
} from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { addTimezoneOffset } from '../../../../util/util';
import { NgbDateNativeAdapter, NgbTimeUTCDateAdapter } from '../../../../util/nbgAdapter';


@Component({
  selector: 'app-hindrance-picker',
  templateUrl: './hindrance-picker.component.html',
  styleUrls: ['./hindrance-picker.component.css'],
  providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeUTCDateAdapter },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
  ]
})
export class HindrancePickerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() markDisabled!: (date: NgbDate, current?: ({ year: number, month: number } | undefined)) => boolean;
  @Input() timeValidators?: ValidatorFn[];
  @Input() setFromTime?: Date;
  @Input() setToTime?: Date;

  @Output() newHindrance = new EventEmitter<Hindrance[]>();

  fromTimeControl!: FormControl;
  toTimeControl!: FormControl;

  hindrances: Hindrance[] = [];
  date: Date | null = null;
  fromTime: Date | null = null;
  toTime: Date | null = null;
  wholeDayHindrance = true;

  addTimeZoneOffset = addTimezoneOffset;

  constructor(private dateAdapter: NgbDateAdapter<Date>, private fb: FormBuilder) {
  }

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

    this.form.addValidators(this.fromTimeAfterToTime());

    console.log(this.markDisabled);
  }

  addHindrance = (): void => {
    if (!this.date) {
      console.log('no hindrance selected');
      return;
    }
    const hindrance = new Hindrance(this.date, this.fromTime, this.toTime, this.wholeDayHindrance);
    this.hindrances.push(hindrance);
    this.hindrances.sort(Hindrance.compare);

    this.newHindrance.emit(this.hindrances);
    console.log('added hindrance: %o\nhindrances: %o', this.date, this.hindrances);
    this.date = null;
  };

  removeHindrance = (index: number): void => {
    this.hindrances.splice(index, 1);
    this.hindrances.sort(Hindrance.compare);
    this.newHindrance.emit(this.hindrances);
    console.log('removed hindrance: %o\nhindrances: %o', this.hindrances);
  };

  toggleHindranceTime = (): void => {
    this.wholeDayHindrance = !this.wholeDayHindrance;
    this.fromTime = this.setFromTime ? this.setFromTime : null;
    this.toTime = this.setToTime ? this.setToTime : null;
    this.fromTimeControl.setErrors(null);
    this.toTimeControl.setErrors(null);
    console.log('wholeDayHindrance: %o', this.wholeDayHindrance);
  };

  hindrancesLength = (): boolean => {
    console.log('hindrancesLength: %o', this.hindrances.length);
    return this.hindrances.length === 0;
  };

  /**
   * Validator that requires fromTime to be before toTime.
   */
  fromTimeAfterToTime = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromTimeControl = control.get('fromTimeControl');
      const toTimeControl = control.get('toTimeControl');

      const fromTime: Date | null = fromTimeControl ? fromTimeControl.value : null;
      const toTime: Date | null = toTimeControl ? toTimeControl.value : null;
      console.log('fromTime: %o, toTime: %o', fromTime, toTime);
      console.log('control: %o', control);
      if (fromTime && toTime) {
        if (fromTime > toTime) {
          return { fromTimeAfterToTime: true };
        }
      }
      return null;
    };
  };

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
