import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Availability, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbTimepickerConfig, NgbTimeStruct, NgbDateNativeUTCAdapter, NgbDateAdapter, NgbTimeAdapter
} from '@ng-bootstrap/ng-bootstrap';
import { Hindrance } from './hindrance-picker/hindrance-picker.component';
import { ngbDateToDate, utcOffset } from '../../../util/util';
import { NgbTimeDateAdapter } from '../../../util/nbgAdapter';


class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}


@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeDateAdapter }]
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
    startDate: new Date(8 * 60 * 60 * 1000 - utcOffset),
    endDate: new Date(18 * 60 * 60 * 1000 - utcOffset),
  }


  availabilityGroup!: FormGroup;

  public availabilities: Availability[] = [];


  hindranceGroup!: FormGroup;

  hindrances: Hindrance[] = [];


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private productService: ProductService,
              private authService: AuthService, private router: Router, private imageService: ImageService, private fb: FormBuilder) {
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

    this.availabilityGroup = this.fb.group({});
    this.hindranceGroup = this.fb.group({});


    this.addProductForm.addControl('availability', this.availabilityGroup);
    this.addProductForm.addControl('hindrance', this.hindranceGroup);
  }

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
      start: new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
      end: new Date(Date.UTC(1970, 0, 1, 23, 59, 59))
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

  addAvailability(availability: Availability[]) {
    this.availabilities = availability;
    console.log('add-product availabilities: %o', this.availabilities);
  }

  // Hindrance picker ------------------------------------------------------

  addHindrance(hindrances: Hindrance[]) {
    this.hindrances = hindrances;
  }

  isOutsideAvailability(this: AddProductComponent) {
    return (date: NgbDate) => {
      const dateNative = ngbDateToDate(date);
      if (this.availabilities.length === 0) {
        return true;
      }
      return !this.availabilities.some(availability => {
        const result = dateNative != null ? (availability.startDate <= dateNative && availability.endDate >= dateNative) : false;
        return result;
      });
    }
  }

  createAvailabilities = (availability: Availability): Availability[] => {
    let availabilities: Availability[] = [];

    // Split availability into multiple availabilities such that the hindrances are excluded
    availabilities = this.splitAvailability(availability, this.hindrances);
    console.log('availabilities: %o', availabilities);

    return availabilities;
  }


  // split Availability at the given dates
  splitAvailability = (availability: Availability, hindrances: Hindrance[]): Availability[] => {
    const availabilities: Availability[] = [];
    const startDate: Date = availability.startDate;
    const endDate: Date = availability.endDate;
    let currentDate: Date = new Date(startDate.getTime() + this.defaultTimeFrame.startDate.getTime());
    // check if there are hindrances between the dates
    const splitDates: Hindrance[] = hindrances.filter(hindrance => availability.startDate <= hindrance.date && hindrance.date <= availability.endDate);
    const dayInMills: number = 24 * 60 * 60 * 1000;

    console.log('splitDates: %o', splitDates)

    if (splitDates.length === 0) {
      availabilities.push(availability);
      return availabilities;
    }

    splitDates.sort(Hindrance.compare);


    for (const splitDate of splitDates) {
      let nextSplitDate: number = splitDate.fromTime ? splitDate.date.getTime() + splitDate.fromTime?.getTime() : splitDate.date.getTime() + this.defaultTimeFrame.startDate.getTime();

      if (splitDate.wholeDay) {
        availabilities.push(new Availability(currentDate, new Date(nextSplitDate - dayInMills + this.defaultTimeFrame.endDate.getTime())));
        currentDate = new Date(nextSplitDate + dayInMills);
        continue;
      }

      if (splitDate.fromTime == this.defaultTimeFrame.startDate) {
        availabilities.push(new Availability(currentDate, new Date(nextSplitDate - dayInMills)));
      } else {
        availabilities.push(new Availability(currentDate, new Date(nextSplitDate)));
      }

      if (splitDate.toTime) {
        if (splitDate.toTime < this.defaultTimeFrame.endDate) {
          currentDate = new Date(splitDate.date.getTime() + splitDate.toTime.getTime());
        }
      } else {
        currentDate = new Date(nextSplitDate + dayInMills);
      }
    }

    // If currentDate isn't >= than endDate add last availability
    console.log('currentDate: %o\nendDate: %o', currentDate, endDate);
    if (currentDate.getTime() < endDate.getTime() + this.defaultTimeFrame.endDate.getTime()) {
      availabilities.push(new Availability(currentDate, endDate));
    }
    return availabilities;
  }

  // Validator functions ------------------------------------------------------


  isInDefaultTimeFrame = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const time = value;

      console.log('Selected Time: %o\nDefaultTimeFrame: %o', time, this.defaultTimeFrame);

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

  // Helper functions


  /**
   * Compares two dates without taking the time into account.
   * @return 0 if the dates are equal, -1 if date1 is before date2, 1 if date1 is after date2
   */
  compareDates = (date1: Date, date2: Date): number => {
    const date1WithoutTime = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2WithoutTime = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.sign(date1WithoutTime - date2WithoutTime);
  }

  ngbTimetoDate = (ngbTime: NgbTimeStruct | null): Date => {
    return ngbTime ? new Date(Date.UTC(1970, 0, 1, ngbTime.hour, ngbTime.minute, ngbTime.second)) : new Date('Invalid Date');
  }
}


