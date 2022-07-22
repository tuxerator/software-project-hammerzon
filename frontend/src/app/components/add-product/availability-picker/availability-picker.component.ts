import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Availability } from '../../../models/Product';
import { updateGroupValidity, utcOffset } from '../../../../util/util';
import { NgbTimeUTCDateAdapter } from '../../../../util/nbgAdapter';

@Component({
  selector: 'app-availability-picker',
  templateUrl: './availability-picker.component.html',
  styleUrls: ['./availability-picker.component.css'],
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeUTCDateAdapter }]
})
export class AvailabilityPickerComponent implements OnInit {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  @Input() form!: FormGroup;

  _defaultTimeFrame: Availability = {
    startDate: new Date(8 * 60 * 60 * 1000 - utcOffset),
    endDate: new Date(18 * 60 * 60 * 1000 - utcOffset),
  };

  @Input() set defaultTimeFrame(value: Availability) {
    this._defaultTimeFrame = value;
  }

  @Input() duration: Date | null = null;

  @Output() defaultTimeFrameChange = new EventEmitter<Availability>();
  @Output() newAvailability = new EventEmitter<Availability[]>();

  fromDateControl!: FormControl;
  toDateControl!: FormControl;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  private _availabilitiesWithoutWeekdays?: Availability[];

  disabledWeekdays: number[] = [];

  set availabilitiesWithoutWeekdays(value: Availability[]) {
    this._availabilitiesWithoutWeekdays = value;

    if (this._availabilitiesWithoutWeekdays) {
      this.availabilities = this._availabilitiesWithoutWeekdays.map(availability => {
        return new AvailabilityWithWeekdays(availability, []);
      });
    }
  }

  availabilities: AvailabilityWithWeekdays[] = [];

  get updateGroupValidity(): (formGroup: FormGroup) => void {
    return updateGroupValidity;
  }

  constructor(private formatter: NgbDateParserFormatter,
              public calendar: NgbCalendar,
              private fb: FormBuilder) {
    this.fromDate = null;
    this.toDate = null;
  }

  ngOnInit(): void {
    // Get FormControls from parent component
    this.fromDateControl = new FormControl('', this.isSelectedWeekday(this.fromDate, this.isDisabledAvailability));
    this.toDateControl = new FormControl('', this.isSelectedWeekday(this.toDate, this.isDisabledAvailability));
    if (!this.form) {
      this.form = this.fb.group({
        fromDateControl: this.fromDateControl,
        toDateControl: this.toDateControl
      });
    } else {
      this.form.addControl('fromDateControl', this.fromDateControl);
      this.form.addControl('toDateControl', this.toDateControl);
    }

    this.form.addValidators(this.isOverlapping(this.availabilities));

  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.fromDateControl.setValue(this.formatter.format(this.fromDate));
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.toDateControl.setValue(this.formatter.format(this.toDate));
      this.form.markAllAsTouched();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.fromDateControl.setValue(this.formatter.format(this.fromDate));
      this.toDateControl.setValue(this.formatter.format(this.toDate));
      this.form.markAllAsTouched();
    }
    updateGroupValidity(this.form);
    console.log(this.form);
  }

  isHovered(date: NgbDate): boolean | null {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean | null {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean | null {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  setFromDate = (currentValue: NgbDate | null, input: string): void => {
    this.fromDate = this.validateInput(currentValue, input);
    this.fromDateControl.updateValueAndValidity();
  };

  setToDate = (currentValue: NgbDate | null, input: string): void => {
    this.toDate = this.validateInput(currentValue, input);
    this.toDateControl.updateValueAndValidity();
  };

  isInvalid = (form: AbstractControl): boolean => {
    return form.touched ? form.invalid : false;
  };

  public isDisabledAvailability = (date: NgbDate | null): boolean => {
    if (!date) {
      return false;
    }
    if (this.isInsideAvailability(date)) {
      return true;
    }
    if (this.disabledWeekdays.includes(this.calendar.getWeekday(date))) {
      return true;
    }
    return date.before(this.calendar.getToday());

  };

  toggleWeekday = (weekday: number): void => {
    this.disabledWeekdays.includes(weekday) ? this.disabledWeekdays.splice(this.disabledWeekdays.indexOf(weekday), 1) : this.disabledWeekdays.push(weekday);
    console.log('toggled weekday: ', weekday);
  };

  addAvailability = (): void => {
    if (!this.fromDate || !this.toDate) {
      console.log('no date selected');
      this.form.markAllAsTouched();
      return;
    }
    const fromDate: Date = this.ngbDateToDate(this.fromDate);
    const toDate: Date = this.ngbDateToDate(this.toDate);
    const availability = new AvailabilityWithWeekdays(new Availability(fromDate, toDate), this.disabledWeekdays.slice());

    this.availabilities.push(availability);
    this.availabilities.sort((a, b) => a.availability.startDate.getTime() - b.availability.startDate.getTime());
    this.fromDate = null;
    this.toDate = null;
    this.form.markAsUntouched();
    this.newAvailability.emit(this.availabilities.flatMap(availability => availability.toAvailabilities(this._defaultTimeFrame)));

    console.log('added avaiLability: %o\navailabilities: %o', availability, this.availabilities);
  };

  removeAvailability = (index: number): void => {
    this.availabilities.splice(index, 1);
    this.newAvailability.emit(this.availabilities.flatMap(availability => availability.toAvailabilities(this._defaultTimeFrame)));
    console.log('removed avaiLability: %o\navailabilities: %o', this.availabilities);
  };

  isInsideAvailability = (date: NgbDate): boolean => {
    for (const availability of this.availabilities) {
      if (availability.availability.startDate.getTime() <= this.ngbDateToDate(date).getTime() && availability.availability.endDate.getTime() >= this.ngbDateToDate(date).getTime()) {
        return true;
      }
    }
    return false;
  };


  // Validator functions -------------------------------------------------------------

  isSelectedWeekday = (date: NgbDate | null, isDisabled: (date: NgbDate | null) => boolean): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const validationError = isDisabled(date) ? { disabledDate: { value: control.value } } : null;
      console.log(validationError);
      return validationError;
    };
  };

  /**
   * Validator that requires that the availabilty does not overlap with any other availabilty
   */
  isOverlapping = (availabilities: AvailabilityWithWeekdays[]): ValidatorFn => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_control: AbstractControl): ValidationErrors | null => {
      const validationError = availabilities.some(availability => {
        // Check for overlapping and if so return ValidationError
        return availability.availability.startDate <= this.ngbDateToDate(this.toDate) &&
          availability.availability.endDate >= this.ngbDateToDate(this.fromDate);
      }) ? { overlapping: { fromDate: this.fromDate, toDate: this.toDate } } : null;
      console.log(validationError);
      return validationError;
    };
  };

  /**
   * Validator that requires defaultTimeFrame to be at least as long as duration.
   */
  defaultTimeFrameLongerThanDuration = (): ValidatorFn => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_control: AbstractControl): ValidationErrors | null => {
      const duration = this.duration?.getTime();

      let validationError: ValidationErrors | null = null;

      // Duration needs to be set
      if (!duration) {

        validationError = {
          noDuration: { message: 'No duration set' }
        };

      }
      else {
        const timeFrame = this._defaultTimeFrame.endDate.getTime() - this._defaultTimeFrame.startDate.getTime();

        // Default time frame needs to be at least as long as duration
        if (timeFrame < duration) {
          validationError = {
            defaultTimeFrameTooShort: {
              message: 'Default time frame is too short',
              duration: duration,
              timeFrame: timeFrame
            }
          };
        }
      }

      console.log(validationError);
      return validationError;
    };
  };

  // Emit defaultTimeFrame
  emitDefaultTimeFrame = (): void => {
    this.defaultTimeFrameChange.emit(this._defaultTimeFrame);
  };

  ngbDateToDate = (ngbDate: NgbDate | null): Date => {
    const jsDate = ngbDate ? new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day) : new Date('Invalid Date');
    ngbDate ? jsDate.setFullYear(ngbDate.year) : null;
    return jsDate;
  };
}

export class AvailabilityWithWeekdays {
  availability: Availability;
  disabledWeekdays: number[];

  constructor(availability: Availability, disabledWeekdays: number[]) {
    this.availability = availability;
    this.disabledWeekdays = disabledWeekdays;
  }

  // Returns all selected weekdays
  getSelectedWeekdays = (weekdays: string[]): string[] => weekdays.filter((weekday: string, index: number): boolean =>
    !this.disabledWeekdays.includes(index + 1));

  public toAvailabilities(defaultTimeFrame: Availability): Availability[] {
    const availabilities: Availability[] = [];
    const startDateDay = this.availability.startDate.getDay();
    let currentDate = this.availability.startDate;
    this.disabledWeekdays.sort((a, b) => a - b);
    if (this.disabledWeekdays.length > 0) {
      // Initialize d with the amount of days to the next disabled weekday
      let d = this.disabledWeekdays[0] >= startDateDay ? this.disabledWeekdays[0] - startDateDay : 7 - startDateDay + this.disabledWeekdays[0];
      let i = 1 % this.disabledWeekdays.length;
      console.log('d: %o', d);

      let nextDate = new Date(currentDate.getTime() + d * 24 * 60 * 60 * 1000);

      while (nextDate < this.availability.endDate) {
        console.log('currentDate: %o, nextDate: %o', currentDate, nextDate);
        console.log('currendDayWeekday: %o, nextDayWeekday: %o', currentDate.getDay(), nextDate.getDay());

        if (!this.disabledWeekdays.some((value => currentDate.getDay() === value % 7))) {
          availabilities.push(new Availability(new Date(currentDate.getTime() + defaultTimeFrame.startDate.getTime()), new Date(nextDate.getTime() - 24 * 60 * 60 * 1000 + defaultTimeFrame.endDate.getTime())));
          currentDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);
        } else {
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        d = this.disabledWeekdays[i] % 7 > nextDate.getDay() ? this.disabledWeekdays[i] % 7 - nextDate.getDay() : this.disabledWeekdays[i] % 7 - nextDate.getDay() + 7;

        console.log('d: %o', d);
        nextDate = new Date(nextDate.getTime() + d * 24 * 60 * 60 * 1000);
        i = (i + 1) % this.disabledWeekdays.length;
      }
    }
    availabilities.push(new Availability(new Date(currentDate.getTime() + defaultTimeFrame.startDate.getTime()), new Date(this.availability.endDate.getTime() + defaultTimeFrame.endDate.getTime())));
    console.log('Emitting availabilities: %o', availabilities);
    return availabilities;
  }
}
