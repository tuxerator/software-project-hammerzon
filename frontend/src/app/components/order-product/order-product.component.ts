import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, PostOrder } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Appointment, getAppointmentString, getDurationString, Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaymentService, PaymentType } from 'src/app/services/payment.service';

@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit {
  product : Product|undefined;
  user: User|undefined;
  appointment:Appointment|undefined;
  appointmentIndex = 0;
  orderRegistered : Boolean|undefined;
  cancelled : Boolean = false;

  public passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    console.log( control);
    return  null //: { notMatch: true };
  };

  public accountForm: FormGroup = this.formBuilder.group({
    account: new FormControl('', [Validators.email,Validators.required]),
    password: new FormControl('', [Validators.required]),
    fullName: new FormControl('', [Validators.required]),
    expirationDate: new FormControl('', [Validators.required]),
  })





  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private payment:PaymentService) {
  }





  paymentType:PaymentType = PaymentType.HCIPAL;

  bestaetigt: Boolean = false;

  switchBest(): void{
    if(!this.bestaetigt)
    {
      this.accountForm.markAllAsTouched()
      console.log(this.accountForm.value);
      if(this.accountForm.valid)
      {
        const account = this.accountForm.value.account;
        this.payment.getRightCountry(this.paymentType,account,`${this.product?.user?.firstName} ${this.product?.user?.lastName} - Hammerzon (Handwerker Portal Gruppe 01)`)
        .subscribe({
          next: () => this.bestaetigt = true,
          error: (err) => console.log(err)
        })
      }
    }
    else{
      this.accountForm.markAllAsTouched();
      console.log(this.accountForm);
      if(this.accountForm.valid)
      {
        const password = this.accountForm.value.password;
        const expirationDate= this.accountForm.value.expirationDate;
        const fullName = this.accountForm.value.fullName
        const postOrder: PostOrder = {productId:this.product!._id, appointmentIndex:this.appointmentIndex};
        this.payment.getPaymentFinish(this.paymentType,postOrder,password,fullName,expirationDate)
        .subscribe({
          next: () => {
            const url = `productdetails/${this.product?._id}/order-product/${this.appointmentIndex}/order-finalized`;
            this.router.navigateByUrl(url);
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    }
  }

  switchPaymentType(type:PaymentType):void {
    this.paymentType = type;
  }

  public get PaymentType() {
    return PaymentType;
  }


  ngOnInit(): void {
    // get the productinfo again
    const routeParams = this.route.snapshot.paramMap;
    const productIDFromRoute = String(routeParams.get('id'));
    const appointmentIndex = parseInt(String(routeParams.get('i')));
    this.appointmentIndex = appointmentIndex;


    /**
     * get information about the product , register the order (make functions?)
     */
    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);
          this.appointment = this.product.appointments[appointmentIndex];
          this.appointment.date = new Date(this.appointment.date);
        },
        error: (err) => {
          console.log(err);

          //this.router.navigateByUrl('not-available');
        }
      }
    );
    // get the userinfo
    this.authService.getUser().subscribe(
      {
        next: (val) => {
          this.user = val;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getAppointString(): string {
    return getAppointmentString(this.appointment?.date);
  }

  public isValid(key:string):boolean
  {
    return !this.accountForm.controls[key].invalid;
  }


}
