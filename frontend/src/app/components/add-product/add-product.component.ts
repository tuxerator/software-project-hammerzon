import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Appointment, Product } from '../../models/Product';
import { IdMessageResponse } from '../types';


class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  public appointmentsCount = 1;

  public appointmentIndexs:string[] = ['appointment0'];

  public imageId?:string = undefined;

  public isChecked = false;
  public uploading = false;

  public errorMessage?: string;
  public addProductForm: FormGroup = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    durationHour: new FormControl('',[Validators.required]),
    durationMinute: new FormControl('',[Validators.required]),
    appointment0: new FormControl('',[Validators.required]),
  });


  constructor(private formBuilder: FormBuilder,private productService:ProductService,private authService:AuthService,private router:Router,private imageService:ImageService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {},
      error: (err) => {
        this.router.navigate(['']);
      }
    });
  }

  public editProduct(aProduct: Product)
  { 
    this.appointmentsCount=aProduct.appointments.length;
    this.imageId=aProduct.image_id;
    this.addProductForm = this.formBuilder.group({
      productName: new FormControl(aProduct.name,[Validators.required]),
      description: new FormControl(aProduct.description,Validators.required),
      prize: new FormControl(aProduct.prize,[Validators.required]),
      durationHour: new FormControl(aProduct.duration.getHours,[Validators.required]),
      durationMinute: new FormControl(aProduct.duration.getMinutes,[Validators.required]),
      appointment0: new FormControl('',[Validators.required])
    })
    for(const appointment of aProduct.appointments)
    {
      const name = `appointment${this.appointmentsCount}`
      this.addProductForm.addControl(name, new FormControl(appointment.date,[Validators.required]));
      this.appointmentIndexs.push(name);
      this.appointmentsCount ++;
    }
  }

  public addAppointment()
  {
    const name = `appointment${this.appointmentsCount}`;
    this.addProductForm.addControl(name,new FormControl('',[Validators.required]));
    this.appointmentIndexs.push(name);
    this.appointmentsCount ++;
  }

  public removeAppointment(name:string)
  {
    this.appointmentIndexs = this.appointmentIndexs.filter(x => x !== name);
    this.addProductForm.removeControl(name);
    //this.addProductForm.addControl(`appointment${this.appointmentsCount}`,new FormControl('',[Validators.required]));
  }

  uploadImage(inputElement:any) {
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
        }}
        );
    });

    reader.readAsDataURL(file);


  }



  public onSubmit():void
    {
      // Wenn du gerade hochlädtst dann sollte es gehe aus submit Raus
      if(this.uploading) return;

      this.isChecked = true;
      console.log('Create Debug Log');
      this.addProductForm.markAllAsTouched();
      // Sind alle Eingaben valid
      console.log(this.addProductForm);
      if(this.addProductForm.invalid|| this.appointmentIndexs.length <= 0 || !this.imageId) return;
      console.log('Through Validation Debug Log');
      // Für besser lesbarkeit des Code
      const form = this.addProductForm.value;

      const prize = parseInt(form.prize);

      const duratioHour = parseInt(form.durationHour);
      const durationMinute = parseInt(form.durationMinute);

      // Neues Datum/Zeitfenster von beginn der Zeitzählung der Computer
      const duration = new Date(0);
      // Stunden hinzufügen

      duration.setHours(duratioHour);
      // Minuten hinzufügen
      duration.setMinutes(durationMinute);

      const appointments:Appointment[] = [];
      // Termine:
      for(const appointName of this.appointmentIndexs)
      {
        const value = form[appointName];
        const date  = new Date(value);

        appointments.push(new Appointment(date));
      }

      // Neues Product erstellen
      const newProduct:Product = new Product(form.productName,form.description,prize,duration,appointments,this.imageId);
      //Product hinzufügen anfrage an das backend schicken
      this.uploading = true;
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
    }

}
