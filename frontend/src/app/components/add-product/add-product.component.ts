import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Appointment, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';


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

  public appointmentIndexs: string[] = ['appointment0'];

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
    appointment0: new FormControl('', [Validators.required]),
  });


  constructor(private formBuilder: FormBuilder,private route:ActivatedRoute,private productService:ProductService,private authService:AuthService,private router:Router,private imageService:ImageService) { }

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
            console.log('Product existiert nicht');
          }
        });
    }
  }
  //
  public editProduct(aProduct: Product)
  {
    this.appointmentsCount=1;
    this.imageId=aProduct.image_id;
    aProduct.duration = new Date(aProduct.duration);
    this.addProductForm = this.formBuilder.group({
      productName: new FormControl(aProduct.name,[Validators.required]),
      description: new FormControl(aProduct.description,Validators.required),
      prize: new FormControl(aProduct.prize,[Validators.required]),
      durationHour: new FormControl(aProduct.duration.getHours(),[Validators.required]),
      durationMinute: new FormControl(aProduct.duration.getMinutes(),[Validators.required]),
    });

    console.log(aProduct.appointments);
    const appointment = aProduct.appointments[0];
    appointment.date = new Date(appointment.date);
    this.addProductForm.setControl('appointment0',new FormControl(this.getDateTimeString(appointment.date),[Validators.required]));

    for( let i = 1; i < aProduct.appointments.length; i++)
    {
      const appointment = aProduct.appointments[i];
      const name = `appointment${this.appointmentsCount}`;

      appointment.date = new Date(appointment.date);
      console.log();


      this.addProductForm.addControl(name, new FormControl(this.getDateTimeString(appointment.date),[Validators.required]));
      this.appointmentIndexs.push(name);
      this.appointmentsCount ++;
    }
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
    this.addProductForm.addControl(name, new FormControl('', [Validators.required]));
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

  public onSubmit():void
    {
      // Wenn du gerade hochlädtst dann sollte es gehe aus submit Raus
      if(this.uploading) return;


    console.log(`AppointmentDate: ${this.addProductForm.value[this.appointmentIndexs[0]]}`);

    this.isChecked = true;
    console.log('Create Debug Log');
    this.addProductForm.markAllAsTouched();
      // Sind alle Eingaben valid
    console.log(this.addProductForm);
    if(this.addProductForm.invalid|| this.appointmentIndexs.length <= 0 || !this.imageId) return;
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

    const appointments: Appointment[] = [];
    // Termine:
    for (const appointName of this.appointmentIndexs) {
      const value = form[appointName];
      const date = new Date(value);

      appointments.push(new Appointment(date));
    }

    const prize = parseFloat(form.prize);

      // Neues Product erstellen
      const newProduct:Product = new Product(form.productName,form.description,prize,duration,appointments,this.imageId);
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

      }else{
        // Sonst upload das neue Product
        uploadProduct();
      }

    }

}
