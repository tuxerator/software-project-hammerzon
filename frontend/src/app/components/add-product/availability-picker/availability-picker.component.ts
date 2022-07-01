import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl, Form, FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Availability } from '../../../models/Product';

@Component({
  selector: 'app-availability-picker',
  templateUrl: './availability-picker.component.html',
  styleUrls: ['./availability-picker.component.css']
})
export class AvailabilityPickerComponent implements OnInit {
  @Input() form!: FormGroup;

  @Output() newAvailability = new EventEmitter<Availability[]>();

  fromDateControl!: FormControl;
  toDateControl!: FormControl;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  disabledWeekdays: number[] = [];

  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  availabilities: AvailabilityWithWeekdays[] = [];

  constructor(private rootFormGroup: FormGroupDirective,
              private formatter: NgbDateParserFormatter,
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
      })
    } else {
      this.form.addControl('fromDateControl', this.fromDateControl);
      this.form.addControl('toDateControl', this.toDateControl);
    }

    this.form.addValidators(this.isOverlapping(this.availabilities));
  }

  onDateSelection(date: NgbDate) {
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
    this.updateGroupValidity(this.form);
    console.log(this.form);
  }


  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
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
  }

  setToDate = (currentValue: NgbDate | null, input: string): void => {
    this.toDate = this.validateInput(currentValue, input);
    this.toDateControl.updateValueAndValidity();
  }

  isFromDate = (date: NgbDate) => date.equals(this.fromDate);

  isToDate = (date: NgbDate) => date.equals(this.toDate);

  isInvalid = (form: AbstractControl): boolean => {
    const invalid = form.touched ? form.invalid : false;
    return invalid;
  }

  public isDisabledAvailability = (date: NgbDate | null) => {
    if (!date) {
      return false;
    }
    if (this.isInsideAvailability(date)) {
      return true;
    }
    if (this.disabledWeekdays.includes(this.calendar.getWeekday(date))) {
      return true;
    }
    if (date.before(this.calendar.getToday())) {
      return true;
    }
    return false;
  }

  toggleWeekday = (weekday: number) => this.disabledWeekdays.includes(weekday) ? this.disabledWeekdays.splice(this.disabledWeekdays.indexOf(weekday), 1) : this.disabledWeekdays.push(weekday);

  addAvailability = (): void => {
    if (!this.fromDate || !this.toDate) {
      console.log('no date selected');
      this.form.markAllAsTouched()
      return;
    }
    const fromDate: Date = this.ngbDateToDate(this.fromDate);
    const toDate: Date = this.ngbDateToDate(this.toDate);
    const availability = new AvailabilityWithWeekdays(new Availability(fromDate, toDate), this.disabledWeekdays.slice());

    this.availabilities.push(availability);
    this.fromDate = null;
    this.toDate = null;
    this.form.markAsUntouched();
    this.newAvailability.emit(availability.toAvailabilities());

    console.log('added avaiLability: %o\navailabilities: %o', availability, this.availabilities);
  }

  removeAvailability = (index: number): void => {
    this.availabilities.splice(index, 1);
    console.log('removed avaiLability: %o\navailabilities: %o', this.availabilities);
  }

  isInsideAvailability = (date: NgbDate): boolean => {
    for (const availability of this.availabilities) {
      if (availability.availability.startDate.getTime() <= this.ngbDateToDate(date).getTime() && availability.availability.endDate.getTime() >= this.ngbDateToDate(date).getTime()) {
        return true;
      }
    }
    return false;
  }

  // Validator functions -------------------------------------------------------------

  isSelectedWeekday = (date: NgbDate | null, isDisabled: (date: NgbDate | null) => boolean): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const validationError = isDisabled(date) ? { disabledDate: { value: control.value } } : null;
      console.log(validationError);
      return validationError;
    };
  }

  /**
   * Validator that requires that the availabilty does not overlap with any other availabilty
   */
  isOverlapping = (availabilities: AvailabilityWithWeekdays[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const validationError = availabilities.some(availability => {
        // Check for overlapping and if so return ValidationError
        return availability.availability.startDate <= this.ngbDateToDate(this.toDate) &&
          availability.availability.endDate >= this.ngbDateToDate(this.fromDate);
      }) ? { overlapping: { fromDate: this.fromDate, toDate: this.toDate } } : null;
      console.log(validationError);
      return validationError;
    };
  }

  // update the validity of the controls in the group
  updateGroupValidity = (formGroup: FormGroup): void => {
    Object.keys(formGroup.controls).forEach(key => formGroup.controls[key].updateValueAndValidity());
    console.log(`Updated Validity for `, formGroup.controls);
  }

  ngbDateToDate = (ngbDate: NgbDate | null): Date => {
    return ngbDate ? new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day)) : new Date('Invalid Date');
  }
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

  public toAvailabilities(): Availability[] {
    const availabilities: Availability[] = [];
    const startDateDay = this.availability.startDate.getDay();
    let currentDate = this.availability.startDate;
    let i: number;
    this.disabledWeekdays.sort((a, b) => a - b);
    if (this.disabledWeekdays.length > 0) {
      // Initialize d with the amount of days to the next disabled weekday
      let d = this.disabledWeekdays.find((value) => startDateDay < value % 7);
      console.log('d: %o', d);
      if (!d) {
        d = this.disabledWeekdays[0] + 7;
        i = 1;
      } else {
        i = this.disabledWeekdays.indexOf(d) + 1;
      }
      d = d - startDateDay;
      let nextDate = new Date(currentDate.getTime() + d * 24 * 60 * 60 * 1000);
      while (nextDate < this.availability.endDate) {
        console.log('currentDate: %o, nextDate: %o', currentDate, nextDate);
        console.log('currendDayWeekday: %o, nextDayWeekday: %o', currentDate.getDay(), nextDate.getDay());
        if (!this.disabledWeekdays.some((value => currentDate.getDay() == value % 7))) {
          availabilities.push(new Availability(currentDate, new Date(nextDate.getTime() - 24 * 60 * 60 * 1000)));
          currentDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);
        } else {
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }
        d = this.disabledWeekdays[i] % 7 > nextDate.getDay() ? this.disabledWeekdays[i] % 7 - nextDate.getDay() : this.disabledWeekdays[i] % 7 - nextDate.getDay() + 7;
        nextDate = new Date(nextDate.getTime() + d * 24 * 60 * 60 * 1000);
        i = (i + 1) % this.disabledWeekdays.length;
      }
    }
    availabilities.push(new Availability(currentDate, this.availability.endDate));
    console.log('Emitting availabilities: %o', availabilities);
    return availabilities;
  }
}
