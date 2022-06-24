import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Availability, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


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

  public productId?:string;

  public errorMessage?: string;

  public addProductForm: FormGroup = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    durationHour: new FormControl('', [Validators.required]),
    durationMinute: new FormControl('', [Validators.required]),
  });

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  disabledWeekdays: number[] = [];

  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  availabilityGroup: FormGroup = new FormGroup({});
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();

  avaliability: Date[] = [];


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private productService: ProductService, private authService: AuthService, private router: Router, private imageService: ImageService,
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private fb: FormBuilder) {
    this.fromDate = null;
    this.toDate = null;
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = routeParams.get('id');
    if(id)
    {
        this.productService.getProductDetails(id).subscribe({
          next: (product) =>
          {
            this.productId = id;
            this.editProduct(product);
          },
          error:() => {

          }
        });
    }

    this.createFormControls();
    this.availabilityGroup = this.fb.group({
      fromDateControl: this.fromDateControl,
      toDateControl: this.toDateControl
    });

    this.addProductForm.addControl('availability', this.availabilityGroup);
  }


  time= {hour:8,minute:0};

  //
  public editProduct(aProduct: Product)
  {
    this.appointmentsCount=0;
    this.imageId=aProduct.image_id;
    aProduct.duration = new Date(aProduct.duration);
    this.addProductForm = this.formBuilder.group({
      productName: new FormControl(aProduct.name,[Validators.required]),
      description: new FormControl(aProduct.description,Validators.required),
      prize: new FormControl(aProduct.prize,[Validators.required]),
      durationHour: new FormControl(aProduct.duration.getHours(),[Validators.required]),
      durationMinute: new FormControl(aProduct.duration.getMinutes(),[Validators.required]),
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

  private getDateTimeString(date:Date):string
  {
    //let dateString:string = date.toLocaleString();
    const dateString:string = `${this.s(date.getFullYear())}-${this.s(date.getMonth()+1)}-${this.s(date.getDate())}T${this.s(date.getHours())}:${this.s(date.getMinutes())}`
    console.log(dateString);

    return dateString;
  }

  private s(number:number):string
  {
    if(number < 10)
    {
      return `0${number}`;
    }
    return `${number}`;
  }

  public addAppointment() {
    const name = `appointment${ this.appointmentsCount }`;
    this.addProductForm.addControl(name+'start', new FormControl('', [Validators.required]));
    this.addProductForm.addControl(name+'end', new FormControl('', [Validators.required]));
    this.addProductForm.addControl(name+'date', new FormControl('', [Validators.required]));
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.availabilityGroup.markAllAsTouched();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.updateGroupValidity(this.availabilityGroup);
  }

  createFormControls() {
    this.fromDateControl = new FormControl('', isSelectedWeekday(this.fromDate, this.isDisabled));
    this.toDateControl = new FormControl('', isSelectedWeekday(this.toDate, this.isDisabled));
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
  updateGroupValidity = (formGroup: FormGroup): void => {
    Object.keys(formGroup.controls).forEach(key => formGroup.controls[key].updateValueAndValidity());
    console.log(`Updated Validity for `, formGroup.controls);
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
      if(this.addProductForm.invalid || !this.imageId || this.fromDate == null || this.toDate == null) return;
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
      const startDate :Date = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);      ;//new Date(this.productForm.value['fromDateControl']);
      const endDate :Date = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);  ;//new Date(this.productForm.value['toDateControl']);

      let availabilities: Availability[] = [{startDate,endDate}];
      console.log(availabilities);
      // Termine:
      for (const availName of this.appointmentIndexs) {
        const start = form[availName+'start'];
        const end = form[availName+'end'];
        const date = new Date(form[availName+'date']);
        const startDate = new Date(date.getTime());

        startDate.setHours(start.hour);
        startDate.setMinutes(start.minute);
        startDate.setSeconds(start.second);

        const endDate = new Date(date.getTime());

        endDate.setHours(end.hour);
        endDate.setMinutes(end.minute);
        endDate.setSeconds(end.second);

        //console.log(startDate,endDate,date,end,start);
       // availability.push(new Availability(date));

        let isInOneSlot =false;
        for(const availbility of availabilities)
        {
          console.log(availbility);
          if(startDate.getTime() >= availbility.startDate.getTime() && endDate.getTime() <= availbility.endDate.getTime())
          {

            availabilities = availabilities.filter(el =>  availbility !== el);
            const firstAv : Availability = {startDate:availbility.startDate, endDate:startDate};
            const secondAv : Availability = {startDate:endDate, endDate:availbility.endDate};
            availabilities.push(firstAv);
            availabilities.push(secondAv);
            break;
          }
        }
      }

      const prize = parseFloat(form.prize);

      // Neues Product erstellen
      const newProduct:Product = new Product(form.productName,form.description,prize,duration,{start:new Date(Date.UTC(0,0,0,0,0,0)),end:new Date( Date.UTC(0,0,0,23,59,59)) },availabilities,this.imageId);
      //Product hinzufügen anfrage an das backend schicken
      this.uploading = true;

     const uploadProduct = () => {
        this.productService.addProduct(newProduct).subscribe({
          next: (_message:IdMessageResponse) => {
            this.errorMessage = undefined;

            this.router.navigate(['productdetails/',_message.id]);
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
      if(this.productId)
      {
        this.productService.removeProduct(this.productId).subscribe({
            next: () => uploadProduct(),
          error: (err) => console.error(err.error)
        });

      } else {
        // Sonst upload das neue Product
        uploadProduct();
      }

  }

  isInvalid = (form: AbstractControl): boolean => {
    const invalid = form.touched ? form.invalid : false;
    console.log(invalid);
    console.log(`form status: ${ form.status } `);
    return invalid;
  }
}


export const isSelectedWeekday = (date: NgbDate | null, isDisabled: (date: NgbDate | null) => boolean): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const validationError = isDisabled(date) ? { disabledDate: { value: control.value } } : null;
    console.log(validationError);
    return validationError;
  };
}
