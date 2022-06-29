import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Availability, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}


@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  public appointmentsCount = 1;

  public appointmentIndexs: string[] = [];

  public imageId?: string = undefined;

  public isChecked = false;
  public uploading = false;

  public productId?: string;

  public errorMessage?: string;

  public addProductForm: FormGroup = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    durationHour: new FormControl('', [Validators.required]),
    durationMinute: new FormControl('', [Validators.required]),
  });

  defaultTimeFrame: Availability = {
    startDate: new Date(),
    endDate: new Date(0, 0, 0, 18, 0, 0),
  }

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  disabledWeekdays: number[] = [];

  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  availabilityGroup: FormGroup = new FormGroup({});
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();
  availabilities: AvailabilityWithWeekdays[] = [];

  hindranceGroup: FormGroup = new FormGroup({});
  dateControl: FormControl = new FormControl();
  fromTimeControl: FormControl = new FormControl();
  toTimeControl: FormControl = new FormControl();
  hindrances: Date[] = [];
  hindrance?: NgbDateStruct;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private productService: ProductService, private authService: AuthService, private router: Router, private imageService: ImageService,
              public calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private fb: FormBuilder) {
    this.fromDate = null;
    this.toDate = null;
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = routeParams.get('id');
    if (id) {
      this.productService.getProductDetails(id).subscribe({
        next: (product) => {
          this.productId = id;
          this.editProduct(product);
        },
        error: () => {

        }
      });
    }

    this.createFormControls();
    this.availabilityGroup = this.fb.group({
      fromDateControl: this.fromDateControl,
      toDateControl: this.toDateControl
    });
    this.hindranceGroup = this.fb.group({
      dateControl: this.dateControl,
      fromTimeControl: this.fromTimeControl,
      toTimeControl: this.toTimeControl
    });

    this.availabilityGroup.addValidators(this.isOverlapping(this.availabilities));

    this.addProductForm.addControl('availability', this.availabilityGroup);
    this.addProductForm.addControl('hindrance', this.hindranceGroup);
  }


  time = { hour: 8, minute: 0 };

  //
  public editProduct(aProduct: Product) {
    this.appointmentsCount = 0;
    this.imageId = aProduct.image_id;
    aProduct.duration = new Date(aProduct.duration);
    this.addProductForm = this.formBuilder.group({
      productName: new FormControl(aProduct.name, [Validators.required]),
      description: new FormControl(aProduct.description, Validators.required),
      prize: new FormControl(aProduct.prize, [Validators.required]),
      durationHour: new FormControl(aProduct.duration.getHours(), [Validators.required]),
      durationMinute: new FormControl(aProduct.duration.getMinutes(), [Validators.required]),
    });

    console.log(aProduct.availability);
    //const appointment = aProduct.appointments[0];
    // appointment.date = new Date(appointment.date);
    //this.addProductForm.setControl('appointment0',new FormControl(this.getDateTimeString(appointment.date),[Validators.required]));

    /*for( let i = 1; i < aProduct.appointments.length; i++)
    {
      const appointment = aProduct.appointments[i];
      const name = `appointment${this.appointmentsCount}`;

      appointment.date = new Date(appointment.date);
      console.log();


      this.addProductForm.addControl(name, new FormControl(this.getDateTimeString(appointment.date),[Validators.required]));
      this.appointmentIndexs.push(name);
      this.appointmentsCount ++;
    }*/
  }

  private getDateTimeString(date: Date): string {
    //let dateString:string = date.toLocaleString();
    const dateString: string = `${ this.s(date.getFullYear()) }-${ this.s(date.getMonth() + 1) }-${ this.s(date.getDate()) }T${ this.s(date.getHours()) }:${ this.s(date.getMinutes()) }`
    console.log(dateString);

    return dateString;
  }

  private s(number: number): string {
    if (number < 10) {
      return `0${ number }`;
    }
    return `${ number }`;
  }

  public addAppointment() {
    const name = `appointment${ this.appointmentsCount }`;
    this.addProductForm.addControl(name + 'start', new FormControl('', [Validators.required]));
    this.addProductForm.addControl(name + 'end', new FormControl('', [Validators.required]));
    this.addProductForm.addControl(name + 'date', new FormControl('', [Validators.required]));
    this.appointmentIndexs.push(name);
    this.appointmentsCount++;
  }

  public removeAppointment(name: string) {
    this.appointmentIndexs = this.appointmentIndexs.filter(x => x !== name);
    this.addProductForm.removeControl(name);
    //this.addProductForm.addControl(`appointment${this.appointmentsCount}`,new FormControl('',[Validators.required]));
  }

  uploadImage(inputElement: any) {
    const file: File = inputElement.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      const selectedFile = new ImageSnippet(event.target.result, file);

      this.imageService.uploadImage(selectedFile.file).subscribe({
          next: (res) => {
            this.imageId = res.id;
          },
          error: (err) => {
            console.log(err);
          }
        }
      );
    });

    reader.readAsDataURL(file);


  }

  public onSubmit(): void {
    // Wenn du gerade hochlädtst dann sollte es gehe aus submit Raus
    if (this.uploading) return;


    //console.log(`AppointmentDate: ${this.addProductForm.value[this.appointmentIndexs[0]+'start']}`);

    this.isChecked = true;
    console.log('Create Debug Log');
    this.addProductForm.markAllAsTouched();
    // Sind alle Eingaben valid
    console.log(this.addProductForm);
    if (this.addProductForm.invalid || !this.imageId || !this.availabilities) return;
    console.log('Through Validation Debug Log');
    // Für besser lesbarkeit des Code
    const form = this.addProductForm.value;

    const duratioHour = parseInt(form.durationHour);
    const durationMinute = parseInt(form.durationMinute);

    // Neues Datum/Zeitfenster von beginn der Zeitzählung der Computer
    const duration = new Date(0);
    // Stunden hinzufügen

    duration.setHours(duratioHour);
    // Minuten hinzufügen
    duration.setMinutes(durationMinute);


    console.log(this.addProductForm.controls['availability'].value);
    const availabilities: Availability[] = this.availabilities.flatMap(this.createAvailabilities);

    const prize = parseFloat(form.prize);

    // Neues Product erstellen
    const newProduct: Product = new Product(form.productName, form.description, prize, duration, {
      start: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
      end: new Date(Date.UTC(0, 0, 0, 23, 59, 59))
    }, availabilities, this.imageId);
    //Product hinzufügen anfrage an das backend schicken
    this.uploading = true;

    const uploadProduct = () => {
      this.productService.addProduct(newProduct).subscribe({
        next: (_message: IdMessageResponse) => {
          this.errorMessage = undefined;

          this.router.navigate(['productdetails/', _message.id]);
          this.uploading = false;
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error(err);
          this.uploading = false;
        }
      });
    };

    // Wenn es das Product schon gegeben hat lösche das alte
    if (this.productId) {
      this.productService.removeProduct(this.productId).subscribe({
        next: () => uploadProduct(),
        error: (err) => console.error(err.error)
      });

    } else {
      // Sonst upload das neue Product
      uploadProduct();
      console.log('Uploaded Product: %o', newProduct);
    }

  }

  // Availability picker ------------------------------------------------------

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.fromDateControl.setValue(this.formatter.format(this.fromDate));
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.toDateControl.setValue(this.formatter.format(this.toDate));
      this.availabilityGroup.markAllAsTouched();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.fromDateControl.setValue(this.formatter.format(this.fromDate));
      this.toDateControl.setValue(this.formatter.format(this.toDate));
      this.availabilityGroup.markAllAsTouched();
    }
    this.updateGroupValidity(this.availabilityGroup);
    console.log(this.availabilityGroup);
  }

  createFormControls() {
    this.fromDateControl = new FormControl('', [
      this.isSelectedWeekday(this.fromDate, this.isDisabledAvailability),
      Validators.required
    ]);
    this.toDateControl = new FormControl('', [
      this.isSelectedWeekday(this.toDate, this.isDisabledAvailability),
      Validators.required,
    ]);

    this.dateControl = new FormControl('');
    this.fromTimeControl = new FormControl('', this.isInDefaultTimeFrame());
    this.toTimeControl = new FormControl('', this.isInDefaultTimeFrame());

  }

  isInDefaultTimeFrame = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const time = new Date(0, 0, 0, value.hour, value.minute);

      if (time.getTime() < this.defaultTimeFrame.startDate.getTime()) {
        return {
          beforeStart: true
        };
      }
      if (time.getTime() > this.defaultTimeFrame.endDate.getTime()) {
        return {
          afterEnd: true
        };
      }

      return null;
    }
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

  isDisabledAvailability = (date: NgbDate | null) => {
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
      this.availabilityGroup.markAllAsTouched()
      return;
    }
    const fromDate: Date = this.ngbDateToDate(this.fromDate);
    const toDate: Date = this.ngbDateToDate(this.toDate);
    const availability = new AvailabilityWithWeekdays(new Availability(fromDate, toDate), this.disabledWeekdays);

    this.availabilities.push(availability);
    this.fromDate = null;
    this.toDate = null;
    this.availabilityGroup.markAsUntouched();

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

  // Hindrance picker ------------------------------------------------------

  isDisabledHindrance = (date: NgbDate | null): boolean => {
    if (!date) {
      return false;
    }
    return !this.isDisabledAvailability(date) || this.disabledWeekdays.includes(this.calendar.getWeekday(date)) || date.before(this.calendar.getToday());
  }

  addHindrance = (): void => {
    if (!this.hindrance) {
      console.log('no hindrance selected');
      return;
    }
    this.hindrances.push(this.ngbDateToDate(NgbDate.from(this.hindrance)));
    console.log('added hindrance: %o\nhindrances: %o', this.hindrance, this.hindrances);
    this.hindrance = undefined;
  }

  removeHinrance = (index: number): void => {
    this.hindrances.splice(index, 1);
    console.log('removed hindrance: %o\nhindrances: %o', this.hindrances);
  }

  createAvailabilities = (avail: AvailabilityWithWeekdays): Availability[] => {
    let availabilities: Availability[] = [];
    const availability = avail.toAvailability();

    // check if there are hindrances between the dates
    const hindrances = this.hindrances.filter(hindrance => {
      return hindrance.getTime() >= availability.startDate.getTime() && hindrance.getTime() <= availability.endDate.getTime();
    });
    console.log('hindrances: %o', hindrances);

    availabilities = this.splitAvailability(availability, hindrances);
    console.log('availabilities: %o', availabilities);

    return availabilities;
  }


// split Availability at the given dates
  splitAvailability = (availability: Availability, splitDates: Date[]): Availability[] => {
    const availabilities: Availability[] = [];
    const startDate: Date = availability.startDate;
    const endDate: Date = availability.endDate;
    let oldSplitDate: Date = startDate;

    splitDates.sort((a, b) => a.getTime() - b.getTime());

    for (const splitDate of splitDates) {
      if (this.compareDates(splitDate, oldSplitDate) < 0) {
        console.log('splitDate %o is before oldSplitDate %o', splitDate, oldSplitDate);
        continue;
      }
      if (this.compareDates(oldSplitDate, splitDate) <= 0 && this.compareDates(splitDate, endDate) <= 0) {
        console.log('splitDate %o is between oldSplitDate %o and endDate %o', splitDate, oldSplitDate, endDate);
        availabilities.push(new Availability(new Date(oldSplitDate), new Date(splitDate.getUTCFullYear(), splitDate.getUTCMonth(),
          splitDate.getUTCDate() - 1, this.defaultTimeFrame.endDate.getUTCHours(), this.defaultTimeFrame.endDate.getUTCMinutes(), this.defaultTimeFrame.endDate.getUTCSeconds())));
      }
      oldSplitDate.setUTCFullYear(splitDate.getUTCFullYear(), splitDate.getUTCMonth(), splitDate.getUTCDate());
    }
    availabilities.push(new Availability(new Date(oldSplitDate), endDate));

    return availabilities;
  }

  // Validator functions ------------------------------------------------------

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
        return this.compareDates(availability.availability.startDate, this.ngbDateToDate(this.toDate)) <= 0 &&
          this.compareDates(availability.availability.endDate, this.ngbDateToDate(this.fromDate)) >= 0;
      }) ? { overlapping: { fromDate: this.fromDate, toDate: this.toDate } } : null;
      console.log(validationError);
      return validationError;
    };
  }

  // Helper functions

  ngbDateToDate = (ngbDate: NgbDate | null): Date => {
    return ngbDate ? new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day)) : new Date('Invalid Date');
  }

  // update the validity of the controls in the group
  updateGroupValidity = (formGroup: FormGroup): void => {
    Object.keys(formGroup.controls).forEach(key => formGroup.controls[key].updateValueAndValidity());
    console.log(`Updated Validity for `, formGroup.controls);
  }

  isInvalid = (form: AbstractControl): boolean => {
    const invalid = form.touched ? form.invalid : false;
    return invalid;
  }

  /**
   * Compares two dates without taking the time into account.
   * @return 0 if the dates are equal, -1 if date1 is before date2, 1 if date1 is after date2
   */
  compareDates = (date1: Date, date2: Date): number => {
    const date1WithoutTime = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2WithoutTime = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.sign(date1WithoutTime - date2WithoutTime);
  }

  // Returns all selected weekdays
  getSelectedWeekdays = (): string[] => this.weekdays.filter((weekday: string, index: number): boolean =>
    !this.disabledWeekdays.includes(index + 1));
}

export class AvailabilityWithWeekdays {
  availability: Availability;
  disabledWeekdays: number[];

  constructor(availability: Availability, disabledWeekdays: number[]) {
    this.availability = availability;
    this.disabledWeekdays = disabledWeekdays;
  }

  public toAvailability(): Availability {
    return this.availability;
  }
}
