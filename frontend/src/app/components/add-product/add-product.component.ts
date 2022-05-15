import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddProductService } from 'src/app/services/add-product.service';
import { Product } from '../models/Product';
@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  public errorMessage?: string;
  public addProductForm: FormGroup = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    appointments: new FormControl('', [Validators.required]),
   
  });


  constructor(private formBuilder: FormBuilder,private addProductService:AddProductService,private router:Router) { }

  ngOnInit(): void {
    this.addProductService.addProduct().subscribe({
      next: (product) => {
        if (product) {
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  public onSubmit():void
    {
      console.log('Create Debug Log');
      this.addProductForm.markAllAsTouched();
      // Sind alle Eingaben valid
      console.log(this.addProductForm);
      if(this.addProductForm.invalid)return;
      console.log('Through Validation Debug Log');
      // Für besser lesbarkeit des Code
      const form = this.addProductForm.value;

      const newProduct:Product = new Product(form.productName,form.company,form.description,form.prize,form.duration,form.appointments);
      // addProductservice hinzufügen anfrage an backend schicken
      this.addProductService.addProduct(newProduct).subscribe({
        next: () => {
          this.errorMessage = undefined;
          this.router.navigate(['productdetails/:id']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error(err);
        }
      });
    }

}
