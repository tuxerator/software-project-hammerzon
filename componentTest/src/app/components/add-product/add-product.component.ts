import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: []
})
export class AddProductComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  disabledWeekdays: number[] = [];

  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  productForm: FormGroup = new FormGroup({});
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private fb: FormBuilder) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.createFormControls()
    this.productForm = this.fb.group({
      fromDateControl: this.fromDateControl,
      toDateControl: this.toDateControl
    });
  }

  createFormControls() {
    this.fromDateControl = new FormControl(this.formatter.format(this.fromDate), isSelectedWeekday(this.isDisabled, this.formatter));
    this.toDateControl = new FormControl(this.formatter.format(this.toDate), isSelectedWeekday(this.isDisabled, this.formatter));
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log('date selected');
    this.productForm.markAllAsTouched();
    this.productForm.controls['fromDateControl'].updateValueAndValidity();
    this.productForm.controls['toDateControl'].updateValueAndValidity();
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
  isDisabled = (date: NgbDate | null) => date ? this.disabledWeekdays.includes(this.calendar.getWeekday(date)) : false;
  toggleWeekday = (weekday: number) => this.disabledWeekdays.includes(weekday) ? this.disabledWeekdays.splice(this.disabledWeekdays.indexOf(weekday), 1) : this.disabledWeekdays.push(weekday);
  updateGroupValidity = (formGroup: FormGroup): void => Object.keys(this.productForm.controls).forEach(key => this.productForm.controls[key].updateValueAndValidity());


  public appointmentsCount = 1;

  public appointmentIndexs: string[] = ['appointment0'];

  public addAppointment() {
    const name = `appointment${ this.appointmentsCount }`;
    this.appointmentIndexs.push(name);
    this.appointmentsCount++;
  }

  time = { hour: 8, minute: 0 };

  consoleLog(message: string) {
    console.log(message);
  }
}

// Checks weather the date is disabled or not
export const isSelectedWeekday = (isDisabled: (date: NgbDate | null) => boolean, formatter: NgbDateParserFormatter): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log(control.value);
    console.log(NgbDate.from(formatter.parse(control.value)));
    const validationError = isDisabled(NgbDate.from(formatter.parse(control.value))) ? { disabledDate: { value: control.value } } : null;
    console.log(validationError);
    return validationError;
  }
};
