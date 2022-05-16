import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductService } from 'src/app/services/add-product.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
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

  public errorMessage?: string;
  public addProductForm: FormGroup = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    durationHour: new FormControl('',[Validators.required]),
    durationMinute: new FormControl('',[Validators.required]),
    appointment0: new FormControl('',[Validators.required]),
  });


  constructor(private formBuilder: FormBuilder,private addProductService:AddProductService,private authService:AuthService,private router:Router,private imageService:ImageService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {},
      error: (err) => {
        this.router.navigate(['']);
      }
    });
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
      console.log('Create Debug Log');
      this.addProductForm.markAllAsTouched();
      // Sind alle Eingaben valid
      console.log(this.addProductForm);
      if(this.addProductForm.invalid|| this.appointmentIndexs.length <= 0)return;
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
      const newProduct:Product = new Product(form.productName,form.description,prize,duration,appointments);
      //Product hinzufügen anfrage an das backend schicken
      this.addProductService.addProduct(newProduct).subscribe({
        next: (_message:IdMessageResponse) => {
          this.errorMessage = undefined;

          this.router.navigate(['productdetails/',_message.id]);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error(err);
        }
      });
    }

}
