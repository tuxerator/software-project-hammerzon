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
  paymentType:PaymentType = PaymentType.HCIPAL;
  modalState: 'confirm'|'pay'|'waiting' = 'confirm';
  merchantName:string = '';

  public PaymentTypeValidators(validatorsByPaymenttype: {[key in PaymentType]:ValidatorFn[][]}): ValidatorFn {
      return (control:AbstractControl):null|ValidationErrors => {
        const i = this.modalState === 'pay' ? 1 : 0;
        const validators:ValidatorFn[] = validatorsByPaymenttype[this.paymentType][i];

        for(const validator of validators)
        {
          const err = validator(control);
          if(err !== null)
          {
            return err;
          }
        }
        return null;
      };
  }
  // Validator werden ausgewählt abhängig von Wo wir uns befinden im Modal und welches Zahlungsmethode gewählt wurde
  public accountForm: FormGroup = this.formBuilder.group({
    account: new FormControl('', this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[Validators.email,Validators.required],[]],
      [PaymentType.SWPSAFE]:[[Validators.required],[]],
      [PaymentType.BACHELORCARD]:[[Validators.required],[]],
    })),
    password: new FormControl('', this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[Validators.required]],
      [PaymentType.SWPSAFE]:[[],[Validators.required]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required]],
    })),
    fullName: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required]],
    })),
    expirationMonth: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required]],
    })),
    expirationYear: new FormControl('',this.PaymentTypeValidators({
      [PaymentType.HCIPAL]: [[],[]],
      [PaymentType.SWPSAFE]:[[],[]],
      [PaymentType.BACHELORCARD]:[[],[Validators.required]],
    })),
  });

  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private payment:PaymentService) {
  }

  confirm(): void{
    if(this.modalState === 'confirm')
    {
      this.accountForm.markAllAsTouched();
      console.log(this.accountForm.value);
      if(this.accountForm.valid)
      {
        const account = this.accountForm.value.account;
        this.merchantName = `${this.product?.user?.firstName} ${this.product?.user?.lastName} - Hammerzon (Handwerker Portal Gruppe 01)`;
        this.payment.getRightCountry(this.paymentType,account,this.merchantName)
        .subscribe({
          next: () => this.modalState = 'pay',
          error: (err) => console.log(err)
        });
      }
    }

  }

  pay():void
  {
    if(this.modalState === 'pay')
    {
      this.accountForm.markAllAsTouched();
      console.log(this.accountForm);
      if(this.accountForm.valid)
        {
          const password = this.accountForm.value.password;
          const expirationMonth= this.accountForm.value.expirationMonth;
          const expirationYear = this.accountForm.value.expirationYear;
          const fullName = this.accountForm.value.fullName;
          const postOrder: PostOrder = {productId:this.product!._id, appointmentIndex:this.appointmentIndex};
          this.modalState = 'waiting';
          this.payment.getPaymentFinish(this.paymentType,postOrder,password,fullName,this.merchantName,`${expirationMonth}/${expirationYear}`)
          .subscribe({
            next: () => {
              const url = `productdetails/${this.product?._id}/order-product/${this.appointmentIndex}/order-finalized`;
              this.router.navigateByUrl(url);
            },
            error: (err) => {
              console.log(err);
            }
          });
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
