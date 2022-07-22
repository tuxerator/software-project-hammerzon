import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Category } from 'src/app/models/Category';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Availability, getCategory, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';
import { NgbDate, NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Hindrance } from './hindrance-picker/hindrance-picker.component';
import { compareDates, ngbDateToDate, utcOffset } from '../../../util/util';
import { NgbTimeUTCDateAdapter } from '../../../util/nbgAdapter';
import { AvailabilityPickerComponent } from './availability-picker/availability-picker.component';


@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeUTCDateAdapter }]
})
export class AddProductComponent implements OnInit {

  public categories?:Category[];

  @ViewChild('availabilityPicker') availabilityPicker!: AvailabilityPickerComponent;

  public appointmentsCount = 1;

  public imageId?: string = undefined;

  private selectedCategory?:Category;



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
    categoryName: new FormControl('',[Validators.required]),
  });

  duration: Date = new Date(0);
  defaultTimeFrame: Availability = {
    startDate: new Date(8 * 60 * 60 * 1000 - utcOffset),
    endDate: new Date(18 * 60 * 60 * 1000 - utcOffset),
  };


  availabilityGroup!: FormGroup;

  public availabilities: Availability[] = [];


  hindranceGroup!: FormGroup;

  hindrances: Hindrance[] = [];


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private productService: ProductService,
              private authService: AuthService,
              private router: Router,
              private imageService: ImageService,
              private categoryService:CategoryService) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = routeParams.get('id');
    if (id) {
      this.productId = id;
      this.productService.getProductDetails(id).subscribe({
        next: (product) => {
          product.availability = product.availability.map(ava =>
            new Availability(new Date(ava.startDate), new Date(ava.endDate)));

          this.editProduct(product);
        }
      });
    }else
    {
        this.searchForCategory();
    }

    this.availabilityGroup = this.formBuilder.group({});
    this.hindranceGroup = this.formBuilder.group({});


    this.addProductForm.addControl('availability', this.availabilityGroup);
    this.addProductForm.addControl('hindrance', this.hindranceGroup);
  }

  public searchForCategory():void
  {
    this.categoryService.getCategoriesList().subscribe({
      next: (val) =>{
        this.categories = val.categories;
        this.categoryChanged();
      },
      error: (err) => console.log(err)
    });
  }

  public categoryChanged():void
  {
    if(this.imageId === this.selectedCategory?.image_id)
    {
      this.imageId = undefined;
    }

    const categoryName = this.addProductForm.value['categoryName'];
    this.selectedCategory = this.categories?.find(c => c.name === categoryName);

    if(!this.imageId)
    {
      this.imageId = this.selectedCategory?.image_id;
    }
  }

  //
  public editProduct(aProduct: Product): void {
    this.imageId = aProduct.image_id;
    aProduct.duration = new Date(aProduct.duration);
    this.addProductForm = this.formBuilder.group({
      productName: new FormControl(aProduct.name, [Validators.required]),
      description: new FormControl(aProduct.description, Validators.required),
      prize: new FormControl(aProduct.prize, [Validators.required]),
      durationHour: new FormControl(aProduct.duration.getHours(), [Validators.required]),
      durationMinute: new FormControl(aProduct.duration.getMinutes(), [Validators.required]),
      categoryName: new FormControl(getCategory(aProduct)?.name,[Validators.required]),
    });

    this.availabilities = aProduct.availability;

    this.availabilityPicker.availabilitiesWithoutWeekdays = this.availabilities;
    this.availabilityPicker.defaultTimeFrame = new Availability(
      new Date(aProduct.defaultTimeFrame.start),
      new Date(aProduct.defaultTimeFrame.end)
    );

    console.log(aProduct.availability);

    this.searchForCategory();
  }

  // chech wether number has 2 or more digits
  private static to2DigitString(number: number): string {
    if (number < 10) {
      return `0${ number }`;
    }
    return `${ number }`;
  }

  private static getDateTimeString(date: Date): string {

    // Create a Input-readable string
    const dateString = `${ AddProductComponent.to2DigitString(date.getFullYear()) }-${ AddProductComponent.to2DigitString(date.getMonth() + 1) }-${ AddProductComponent.to2DigitString(date.getDate()) }T${ AddProductComponent.to2DigitString(date.getHours()) }:${ AddProductComponent.to2DigitString(date.getMinutes()) }`;
    console.log(dateString);

    return dateString;
  }

  isOutsideAvailability(this: AddProductComponent): (date: NgbDate) => boolean {
    return (date: NgbDate): boolean => {
      const dateNative = ngbDateToDate(date);
      if (this.availabilities.length === 0) {
        return true;
      }
      return !this.availabilities.some(availability => {
        return dateNative !== null ? (compareDates(availability.startDate, dateNative) <= 0 && compareDates(dateNative, availability.endDate) <= 0) : false;
      });
    };
  }

  uploadImage(inputElement: HTMLInputElement): void {
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    this.imageId = undefined;
    const file: File = inputElement.files[0];
    this.imageService.uploadFileImage(file, this.imageId).subscribe({
      next: (res) => {
        this.setImageId(res.id);
      },
      error: (err) => {
        console.log(err);
      }
    }
  );
  }

  private setImageId(id:string):void
  {
    this.imageId = id;
  }

  public onSubmit(): void {
    // Wenn du gerade hochlädtst dann sollte es gehe aus submit Raus
    if (this.uploading) return;



    this.isChecked = true;
    console.log('Create Debug Log');
    this.addProductForm.markAllAsTouched();
    // Sind alle Eingaben valid
    console.log(this.addProductForm);
    if (this.addProductForm.invalid || !this.imageId || !this.availabilities || !this.selectedCategory) return;
    console.log('Through Validation Debug Log');
    // Für besser lesbarkeit des Code
    const form = this.addProductForm.value;

    const durationHour = parseInt(form.durationHour);
    const durationMinute = parseInt(form.durationMinute);

    // Neues Datum/Zeitfenster von beginn der Zeitzählung der Computer
    const duration = new Date(0);
    // Stunden hinzufügen

    duration.setUTCHours(durationHour);
    // Minuten hinzufügen
    duration.setUTCMinutes(durationMinute);


    const availabilities: Availability[] = this.availabilities;

    const prize = parseFloat(form.prize);

    // Neues Product erstellen
    const newProduct: Product = new Product(
      form.productName,
      form.description,
      prize,
      duration,
      {
        start: this.defaultTimeFrame.startDate,
        end: this.defaultTimeFrame.endDate
      },
      availabilities,
      this.imageId,
      this.selectedCategory._id
    );
    //Product hinzufügen anfrage an das backend schicken
    this.uploading = true;

    const uploadProduct = ():void => {
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

  addAvailability(availability: Availability[]): void {
    this.availabilities = availability;
    this.availabilities.flatMap(this.createAvailabilities);
    console.log('add-product availabilities: %o', this.availabilities);
  }

  // Hindrance picker ------------------------------------------------------

  updateDuration = (): void => {
    const hoursControl = this.addProductForm.get('durationHour') as FormControl;
    const minutesControl = this.addProductForm.get('durationMinute') as FormControl;
    const hours = hoursControl ? parseInt(hoursControl.value, 10) : 0;
    const minutes = minutesControl ? parseInt(minutesControl.value, 10) : 0;
    this.duration.setUTCHours(hours);
    this.duration.setUTCMinutes(minutes);
  };

  addHindrance(hindrances: Hindrance[]): void {
    this.hindrances = hindrances;
    this.availabilities = this.availabilities.flatMap(this.createAvailabilities);
    console.log('add-product availabilities: %o', this.availabilities);
  }

  createAvailabilities = (availability: Availability): Availability[] => {
    //const availabilities:

    // Split availability into multiple availabilities such that the hindrances are excluded
    console.log('hindrances: %o', this.hindrances);
    const availabilities: Availability[] = this.splitAvailability(availability, this.hindrances);
    console.log('availabilities: %o', availabilities);

    return availabilities;
  };


  // split Availability at the given dates
  splitAvailability = (availability: Availability, hindrances: Hindrance[]): Availability[] => {
    const availabilities: Availability[] = [];
    const startDate: Date = availability.startDate;
    const endDate: Date = availability.endDate;
    let currentDate: number = startDate.getTime();
    // check if there are hindrances between the dates
    const splitDates: Hindrance[] = hindrances.filter(hindrance => {
      const hindranceStartDate: Date = hindrance.fromTime ? new Date(hindrance.date.getTime() + hindrance.fromTime.getTime()) : hindrance.date;
      const hindranceEndDate: Date = hindrance.toTime ? new Date(hindrance.date.getTime() + hindrance.toTime.getTime()) : hindrance.date;
      return availability.startDate <= hindranceStartDate && hindranceEndDate <= availability.endDate;
    });
    const dayInMills: number = 24 * 60 * 60 * 1000;

    console.log('splitDates: %o', splitDates);

    if (splitDates.length === 0) {
      availabilities.push(availability);
      return availabilities;
    }

    splitDates.sort(Hindrance.compare);


    for (const splitDate of splitDates) {
      console.log('splitDate: %o', splitDate);
      console.log('defaultTimeFrame: %o', this.defaultTimeFrame);

      const nextSplitDate: number =  splitDate.date.getTime();
      const availabilityStartDate: number = currentDate;
      let availabilityEndDate: number = nextSplitDate - dayInMills + this.defaultTimeFrame.endDate.getTime();
      currentDate = nextSplitDate + dayInMills + this.defaultTimeFrame.startDate.getTime();

      if (splitDate.fromTime && splitDate.fromTime.getTime() !== this.defaultTimeFrame.startDate.getTime()) {
        availabilityEndDate = nextSplitDate + splitDate.fromTime.getTime();
      }

      if (splitDate.toTime) {
        if (splitDate.toTime < this.defaultTimeFrame.endDate) {
          currentDate = nextSplitDate + splitDate.toTime.getTime();
        }
      }

      if (availabilityStartDate === availabilityEndDate) {
        continue;
      }
      availabilities.push(new Availability(new Date(availabilityStartDate), new Date(availabilityEndDate)));
    }

    // If currentDate isn't >= than endDate add last availability
    console.log('currentDate: %o\nendDate: %o', new Date(currentDate), endDate);
    if (currentDate < endDate.getTime()) {
      availabilities.push(new Availability(new Date(currentDate), endDate));
    }
    return availabilities;
  };

  // Validator functions ------------------------------------------------------


  isInDefaultTimeFrame = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const time = value;


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
    };
  };

  // Helper functions
  ngbTimetoDate = (ngbTime: NgbTimeStruct | null): Date => {
    return ngbTime ? new Date(Date.UTC(1970, 0, 1, ngbTime.hour, ngbTime.minute, ngbTime.second)) : new Date('Invalid Date');
  };
}


